import React, { useState } from 'react';
import { Search, Send, Phone, Video, Info, MoreVertical, Paperclip, Smile, Plus } from 'lucide-react';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Team Alpha',
      avatar: '👥',
      lastMessage: 'Resource allocation complete',
      time: '5 min',
      unread: 2,
      online: true,
      members: 4,
    },
    {
      id: 2,
      name: 'Operations Center',
      avatar: '🎯',
      lastMessage: 'All units reported position',
      time: '12 min',
      unread: 0,
      online: true,
      members: 8,
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      avatar: '👩‍💼',
      lastMessage: 'Thanks for the update',
      time: '1h',
      unread: 0,
      online: true,
      members: 1,
    },
    {
      id: 4,
      name: 'Emergency Response',
      avatar: '🚨',
      lastMessage: 'Standby for instructions',
      time: '2h',
      unread: 1,
      online: true,
      members: 12,
    },
    {
      id: 5,
      name: 'Medical Team',
      avatar: '⚕️',
      lastMessage: 'Casualty count updated',
      time: '3h',
      unread: 0,
      online: false,
      members: 6,
    },
    {
      id: 6,
      name: 'Logistics Hub',
      avatar: '📦',
      lastMessage: 'Supplies en route',
      time: '5h',
      unread: 0,
      online: true,
      members: 5,
    },
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: 'You',
        avatar: '👤',
        content: 'Hi Team Alpha, any updates on the resource allocation?',
        time: '10:30 AM',
        own: true,
      },
      {
        id: 2,
        sender: 'Michael Torres',
        avatar: '👨‍💼',
        content: 'We have successfully allocated 80% of the requested resources to sector 3.',
        time: '10:32 AM',
        own: false,
      },
      {
        id: 3,
        sender: 'Michael Torres',
        avatar: '👨‍💼',
        content: 'Medical supplies and rescue equipment are being deployed now.',
        time: '10:33 AM',
        own: false,
      },
      {
        id: 4,
        sender: 'Emily Chen',
        avatar: '👩‍🚒',
        content: 'Confirming receipt. Teams are standing by for deployment.',
        time: '10:35 AM',
        own: false,
      },
      {
        id: 5,
        sender: 'You',
        avatar: '👤',
        content: 'Excellent! What about the remaining 20%?',
        time: '10:36 AM',
        own: true,
      },
      {
        id: 6,
        sender: 'Michael Torres',
        avatar: '👨‍💼',
        content: 'Resource allocation complete',
        time: '10:38 AM',
        own: false,
      },
    ],
  };

  const currentChat = conversations.find(c => c.id === selectedChat);
  const chatMessages = messages[selectedChat] || [];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid min-h-[calc(100vh-12rem)] grid-cols-[320px_minmax(0,1fr)]">
        {/* Conversations Sidebar */}
        <div className="flex flex-col border-r border-slate-200 bg-white">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* New Message Button */}
        <div className="px-6 py-4 border-b border-slate-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
            <Plus className="w-4 h-4" />
            New Message
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={`w-full text-left px-6 py-4 border-b border-slate-100 transition-colors ${
                selectedChat === conv.id
                  ? 'bg-blue-50 border-l-4 border-blue-600'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-xl">
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {conv.unread}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col bg-slate-50">
        {currentChat && (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-slate-200 px-8 flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-xl">
                    {currentChat.avatar}
                  </div>
                  {currentChat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">{currentChat.name}</h2>
                  <p className="text-sm text-slate-600">{currentChat.members} members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                  <Info className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.own ? 'flex-row-reverse' : ''}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg">
                    {msg.avatar}
                  </div>
                  <div className={`flex flex-col ${msg.own ? 'items-end' : 'items-start'} max-w-md`}>
                    <p className="text-xs text-slate-500 mb-1">{msg.sender} · {msg.time}</p>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        msg.own
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-slate-200 p-6 bg-white sticky bottom-0">
              <div className="flex gap-3 items-end">
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                  <button className="absolute right-3 top-2.5 p-1 hover:bg-slate-100 rounded-lg text-slate-600">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex-shrink-0 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
