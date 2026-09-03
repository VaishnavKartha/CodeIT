import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { MonacoBinding } from 'y-monaco';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Auth } from '../context/AuthContext';
import { Room } from '../context/RoomContext';

const CollabEditor = ({activeLanguage,onDocReady=()=>{}}) => {
  const [editorInstance, setEditorInstance] = useState(null);
  const [isSynced, setIsSynced] = useState(false);
  const { roomid } = useParams();
  
  const ydocRef = useRef(null);
  const ymapRef = useRef(null);
  const providerRef = useRef(null);
  const {authUser} = useContext(Auth);

  const {setOnlineMembers,setLiveLanguage} = useContext(Room);

  // 1. Initialize Yjs and WebSocket Provider immediately when the room changes
  useEffect(() => {
    setIsSynced(false); // Reset sync flag on room change
    const ydoc = new Y.Doc();
    const provider = new HocuspocusProvider({
        url: 'ws://localhost:5175',
        name: roomid,        // same role as the "room name" argument before
        document: ydoc,
        onStatus:({status})=>{
          console.log(`Connection Status:${status}`);
        },
        onSynced:({state})=>{
          console.log(`Sync Status:${state}`);

          if(state){
            setIsSynced(state);
          }
        },
        
        onAwarenessChange:({states})=>{
          console.log(states)
          const users = states.map(s=>s.user).filter(Boolean);
          console.log(users);
          setOnlineMembers(users);
        }
    });

    provider.setAwarenessField('user',{
      id:authUser?.userId,
      name:authUser?.username
    })

    ydocRef.current = ydoc;
    providerRef.current = provider;
    onDocReady(ydoc)
    const ymap = ydoc.getMap("language");
    const handleChange=()=>{
      const lang = ymap.get("language");
      console.log(lang);
      if(lang){
        setLiveLanguage(lang);
      }


    }
    ymap.observe(handleChange)
    handleChange();

    

    return () => {
      provider.destroy();
      ydoc.destroy();
      ymap.unobserve(handleChange)
    };
  }, [roomid]);

  // 2. Bind Monaco to Yjs text ONLY when BOTH the editor is mounted AND network sync is done
  useEffect(() => {
    if (!editorInstance || !isSynced) return;

    const ydoc = ydocRef.current;
    const provider = providerRef.current;
    const yText = ydoc.getText('editor');

    console.log('[DEBUG ENGINE] Attaching binding. Text state received:', yText.toString());

    // Create the binding
    const binding = new MonacoBinding(
      yText,
      editorInstance.getModel(),
      new Set([editorInstance]),
      provider.awareness
    );

    return () => {
      binding.destroy();
    };
  }, [editorInstance, isSynced]); 

  

  const handleMount = (editor) => {
    setEditorInstance(editor);
  };

  return (
    <div>
      {!isSynced && <div style={{color: 'white', padding: '10px'}}>Syncing documents with server...</div>}
      <Editor
        height="90vh"
        language={activeLanguage.toLowerCase()}
        theme="vs-dark"
        onMount={handleMount}
        options={{ minimap: { enabled: false }, contextmenu: false }}
      />
    </div>
  );
};

export default CollabEditor;
