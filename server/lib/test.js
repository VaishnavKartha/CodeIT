import { runInSandbox } from './runCode.sandbox.js';

export const runTest=async()=>{

    const tests = [
      {
        label: 'JavaScript — reads stdin, prints output',
        language: 'javascript',
        code:
`const input = require('fs').readFileSync(0, 'utf-8').trim();
console.log('Hello, ' + input + '!');
console.log('Sum: ' + (2 + 3));`
    ,
        stdin: 'Vaishnav\n',
      },
      {
        label: 'Python — reads stdin, prints output',
        language: 'python',
        code: 
`name = input()
print(f"Hello, {name}!")
print(f"Sum: {2 + 3}")`
    ,
        stdin: 'Vaishnav\n',
      },
      {
        label: 'Python — deliberate syntax error (should populate stderr, not crash the function)',
        language: 'python',
        code: `print("missing closing paren"`,
        stdin: '',
      },
      {
        label: 'JavaScript — infinite loop (should be killed by the 8s timeout, not hang forever)',
        language: 'javascript',
        code: `while (true) {}`,
        stdin: '',
      },
    ];
    
    for (const test of tests) {
      console.log(`\n=== ${test.label} ===`);
      const start = Date.now();
      const result = await runInSandbox(test.language, test.code, test.stdin);
      const elapsedMs = Date.now() - start;
      console.log(result);
      console.log(`(took ${elapsedMs}ms)`);
    }
}
