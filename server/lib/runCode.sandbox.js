import Docker from 'dockerode';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

const docker = new Docker();



const PROFILES = {

    javascript: {
        image: 'node:20-slim',
        filename: 'main.js',

      
        cmd: ({ file }) => [
            'sh',
            '-c',
            `node ${file} < /sandbox/input.txt`
        ],
    },


    python: {
        image: 'python:3.12-slim',
        filename: 'main.py',

        cmd: ({ file }) => [
            'sh',
            '-c',
            `python3 ${file} < /sandbox/input.txt`
        ],
    },


    java: {
        image: 'openjdk:17-slim',
        filename: 'Main.java',

        cmd: ({ dir }) => [
            'sh',
            '-c',
            `cd ${dir} && javac Main.java && java Main < /sandbox/input.txt`
        ],
    },
};




export async function runInSandbox(
    language,
    code,
    stdin = '',
    timeoutMs = 8000
) {



    const profile = PROFILES[language];

    if (!profile) {
        throw new Error(
            `Unsupported language: ${language}`
        );
    }




    const workDir = path.join(
        os.tmpdir(),
        `sandbox-${crypto.randomUUID()}`
    );

    await fs.mkdir(
        workDir,
        {
            recursive: true
        }
    );

    const hostFile = path.join(
        workDir,
        profile.filename
    );

    await fs.writeFile(
        hostFile,
        code,
        'utf8'
    );



    const hostInputFile = path.join(
        workDir,
        'input.txt'
    );

    await fs.writeFile(
        hostInputFile,
        String(stdin ?? ''),
        'utf8'
    );


    let container = null;

    try {

      

        const cmd = profile.cmd({
            file: `/sandbox/${profile.filename}`,
            dir: '/sandbox'
        });


        console.log(
            '[sandbox] Creating container...'
        );

        console.log(
            '[sandbox] Language:',
            language
        );

        console.log(
            '[sandbox] Command:',
            cmd
        );


       

        container = await docker.createContainer({

            Image: profile.image,

            Cmd: cmd,


           
            AttachStdin: false,

            AttachStdout: true,

            AttachStderr: true,

            Tty: false,


            HostConfig: {

                Binds: [
                    `${workDir}:/sandbox:ro`
                ],


                Memory: 128 * 1024 * 1024,


               
                NanoCpus: 500_000_000,


              
                PidsLimit: 64,


               
                NetworkMode: 'none',


            
                ReadonlyRootfs: true,


               
                Tmpfs: {
                    '/tmp': 'size=16m'
                },


                AutoRemove: false,


              
                SecurityOpt: [
                    'no-new-privileges'
                ],
            }
        });


        console.log(
            '[sandbox] Container created:',
            container.id
        );


    

        await container.start();

        console.log(
            '[sandbox] Container started:',
            container.id
        );


       

        let timedOut = false;

        let timeoutHandle = null;


        const timeoutPromise = new Promise(
            async (resolve) => {

                timeoutHandle = setTimeout(
                    async () => {

                        timedOut = true;

                        console.log(
                            `[sandbox] Timeout reached (${timeoutMs}ms)`
                        );


                        try {

                            await container.kill();

                            console.log(
                                '[sandbox] Container killed'
                            );

                        } catch (err) {

                            console.log(
                                '[sandbox] Kill error:',
                                err.message
                            );
                        }


                        resolve();

                    },
                    timeoutMs
                );
            }
        );


        const waitPromise = container.wait();


        const waitResult = await Promise.race([
            waitPromise,
            timeoutPromise
        ]);


     

        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }


      

        let exitCode;


        if (waitResult) {

            exitCode =
                waitResult.StatusCode;

        } else {

  

            try {

                const finalResult =
                    await container.wait();

                exitCode =
                    finalResult.StatusCode;

            } catch (err) {

                console.log(
                    '[sandbox] Error waiting after kill:',
                    err.message
                );

                exitCode = 137;
            }
        }

        let stdout = '';
        let stderr = '';


        try {

            const logs =
                await container.logs({

                    stdout: true,

                    stderr: true,

                    timestamps: false
                });


            

            if (Buffer.isBuffer(logs)) {

                let stdoutBuffer = '';
                let stderrBuffer = '';

                let offset = 0;


                while (offset + 8 <= logs.length) {

                    const streamType =
                        logs[offset];

                    const size =
                        logs.readUInt32BE(
                            offset + 4
                        );


                    const start =
                        offset + 8;

                    const end =
                        start + size;


                    if (end > logs.length) {
                        break;
                    }


                    const chunk =
                        logs.subarray(
                            start,
                            end
                        );


                    if (streamType === 1) {

                        stdoutBuffer +=
                            chunk.toString('utf8');

                    } else if (streamType === 2) {

                        stderrBuffer +=
                            chunk.toString('utf8');
                    }


                    offset = end;
                }


                stdout = stdoutBuffer;

                stderr = stderrBuffer;

            } else {

              
                stdout = String(logs);
            }

        } catch (err) {

            console.log(
                '[sandbox] Error reading logs:',
                err.message
            );
        }


       

        console.log(
            '[sandbox] Container exited'
        );

        console.log(
            '[sandbox] Exit code:',
            exitCode
        );

        console.log(
            '[sandbox] Timed out:',
            timedOut
        );

        console.log(
            '[sandbox] STDOUT:',
            JSON.stringify(stdout)
        );

        console.log(
            '[sandbox] STDERR:',
            JSON.stringify(stderr)
        );


       

        return {
            exitCode,
            stdout,
            stderr,
            timedOut
        };


    } catch (err) {

        console.error(
            '[sandbox] Execution error:',
            err
        );


        return {

            exitCode: null,

            stdout: '',

            stderr:
                String(
                    err?.message ||
                    err
                ),

            timedOut
        };


    } finally {

        if (container) {
        try {
            await container.remove({
                force: true
            });

            console.log(
                '[sandbox] Container removed:',
                container.id
            );

        } catch (err) {

            console.log(
                '[sandbox] Failed to remove container:',
                err.message
            );
        }
    }

       

        await fs.rm(
            workDir,
            {
                recursive: true,
                force: true
            }
        ).catch((err) => {

            console.log(
                '[sandbox] Failed to remove work directory:',
                err.message
            );
        });
    }
}