import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEdit from '../Hooks/useEdit';
import axiosInstance from '../lib/axios';
import RoomForm from '../components/RoomForm';
import Loader from '../components/Loader';
import { 
  Settings, 
  Plus, 
  Search, 
  Terminal, 
  Clock, 
  Code2, 
  ArrowUpRight, 
  FolderGit2 
} from 'lucide-react';

const langColorMap = {
  python: { 
    label: 'Python', 
    badge: 'text-sky-400 bg-sky-500/10 border-sky-500/20' 
  },
  javascript: { 
    label: 'JavaScript', 
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
  },
  typescript: { 
    label: 'TypeScript', 
    badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
  },
  cpp: { 
    label: 'C++', 
    badge: 'text-pink-400 bg-pink-500/10 border-pink-500/20' 
  },
  c: { 
    label: 'C', 
    badge: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' 
  },
  java: { 
    label: 'Java', 
    badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20' 
  },
};

const Home = () => {
  const [isFetching, setIsFetching] = useState(true);
  const { getRooms } = useEdit();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getAllRooms = async () => {
      try {
        const fetchedRooms = await getRooms();
        setRooms(fetchedRooms || []);
      } catch (error) {
        // handle error
      } finally {
        setIsFetching(false);
      }
    };

    getAllRooms();
  }, []);

  const openEditor = async (roomId) => {
    try {
      await axiosInstance.get(`/room/${roomId}`);
      navigate(`/room/${roomId}/edit`);
    } catch (error) {
      // handle error
    }
  };

  const filteredRooms = rooms.filter((item) => {
    const name = item?.roomId?.roomName?.toLowerCase() || '';
    const lang = item?.roomId?.language?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || lang.includes(q);
  });

  if (isFetching) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100 selection:bg-blue-600/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-[#161b22]/70 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
              <Terminal className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Code<span className="text-blue-500">IT</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm shadow-blue-900/30"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>

            <button
              onClick={() => navigate('/settings')}
              title="Settings"
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
            >
              <Settings className="h-5 w-5 transition-transform hover:rotate-45" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className=" relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search workspaces or languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161b22] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <p className="text-xs text-zinc-500 self-end sm:self-auto">
            Showing {filteredRooms.length} of {rooms.length} room{rooms.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Room Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => {
              const rData = room?.roomId;
              if (!rData) return null;

              const langKey = rData.language?.toLowerCase() || '';
              const langConfig = langColorMap[langKey] || {
                label: rData.language || 'Plain Text',
                badge: 'text-zinc-400 bg-zinc-800/60 border-zinc-700',
              };

              return (
                <div
                  key={rData._id}
                  onClick={() => openEditor(rData._id)}
                  className="group relative flex flex-col justify-between bg-[#161b22] hover:bg-[#1b222c] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-5 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40"
                >
                  <div>
                    {/* Top Row: Tag & Action */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${langConfig.badge}`}
                      >
                        <Code2 className="h-3 w-3" />
                        {langConfig.label}
                      </span>

                      <div className="text-zinc-500 group-hover:text-blue-400 transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Room Name */}
                    <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {rData.roomName || 'Untitled Room'}
                    </h3>
                  </div>

                  {/* Bottom Row: Timestamp */}
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 border-t border-zinc-800/70 pt-3 mt-4">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Updated{' '}
                      {rData.updatedAt
                        ? new Date(rData.updatedAt).toLocaleDateString("en-Us", {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recently'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-xl bg-[#161b22]/30">
            <div className="h-12 w-12 rounded-full bg-zinc-800/80 flex items-center justify-center mb-4 text-zinc-400">
              <FolderGit2 className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-medium text-zinc-200 mb-1">
              {searchQuery ? 'No matching rooms found' : 'No coding rooms yet'}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mb-4">
              {searchQuery
                ? 'Try tweaking your search term to find what you are looking for.'
                : 'Create your first collaborative room to write, run, and review code together.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Create Room
              </button>
            )}
          </div>
        )}
      </main>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
          <RoomForm />
        </div>
      )}
    </div>
  );
};

export default Home;