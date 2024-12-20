import React, { useState } from 'react';
import { Send, Plus, Trash2 } from 'lucide-react';
import type { DiscordWebhookMessage, DiscordEmbed } from '../types/discord';

const inputClasses = "w-full p-2 rounded bg-[#40444b] border-[#202225] border text-white placeholder-gray-400 focus:ring-2 focus:ring-[#5865F2] focus:border-transparent";
const buttonClasses = "flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors";

export default function WebhookForm() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [message, setMessage] = useState<DiscordWebhookMessage>({
    content: '',
    username: '',
    avatar_url: '',
    embeds: []
  });
  const [error, setError] = useState('');

  const addEmbed = () => {
    setMessage(prev => ({
      ...prev,
      embeds: [...(prev.embeds || []), {
        title: '',
        description: '',
        color: 0x5865F2
      }]
    }));
  };

  const removeEmbed = (index: number) => {
    setMessage(prev => ({
      ...prev,
      embeds: prev.embeds?.filter((_, i) => i !== index)
    }));
  };

  const updateEmbed = (index: number, embed: DiscordEmbed) => {
    setMessage(prev => ({
      ...prev,
      embeds: prev.embeds?.map((e, i) => i === index ? embed : e)
    }));
  };

  const sendWebhook = async () => {
    try {
      setError('');
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to send webhook');
      }

      alert('Webhook sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send webhook');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Webhook Configuration</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Webhook URL</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className={inputClasses}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Message Content</label>
            <textarea
              value={message.content}
              onChange={(e) => setMessage(prev => ({ ...prev, content: e.target.value }))}
              className={inputClasses}
              rows={3}
              placeholder="Enter your message content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Username Override</label>
            <input
              type="text"
              value={message.username}
              onChange={(e) => setMessage(prev => ({ ...prev, username: e.target.value }))}
              className={inputClasses}
              placeholder="Custom username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Avatar URL</label>
            <input
              type="text"
              value={message.avatar_url}
              onChange={(e) => setMessage(prev => ({ ...prev, avatar_url: e.target.value }))}
              className={inputClasses}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Embeds</h3>
              <button
                onClick={addEmbed}
                className={`${buttonClasses} bg-[#3ba55c] hover:bg-[#2d7d46] text-white`}
              >
                <Plus size={16} /> Add Embed
              </button>
            </div>

            {message.embeds?.map((embed, index) => (
              <div key={index} className="bg-[#40444b] rounded p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-white">Embed {index + 1}</h4>
                  <button
                    onClick={() => removeEmbed(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <input
                  type="text"
                  value={embed.title}
                  onChange={(e) => updateEmbed(index, { ...embed, title: e.target.value })}
                  className={inputClasses}
                  placeholder="Embed Title"
                />

                <textarea
                  value={embed.description}
                  onChange={(e) => updateEmbed(index, { ...embed, description: e.target.value })}
                  className={inputClasses}
                  rows={3}
                  placeholder="Embed Description"
                />

                <input
                  type="color"
                  value={`#${(embed.color || 0).toString(16).padStart(6, '0')}`}
                  onChange={(e) => updateEmbed(index, { 
                    ...embed, 
                    color: parseInt(e.target.value.replace('#', ''), 16)
                  })}
                  className="w-full bg-[#40444b] rounded"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="text-red-400 p-2 bg-red-900/50 rounded">
              {error}
            </div>
          )}

          <button
            onClick={sendWebhook}
            disabled={!webhookUrl}
            className={`${buttonClasses} w-full justify-center bg-[#5865F2] hover:bg-[#4752C4] text-white disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Send size={16} /> Send Webhook
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Preview</h2>
          
          <div className="border border-[#202225] rounded-lg p-4 bg-[#36393f] text-white space-y-4">
            <div className="flex items-center gap-3">
              {message.avatar_url && (
                <img
                  src={message.avatar_url}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
              )}
              <strong>{message.username || 'Webhook'}</strong>
            </div>

            {message.content && (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}

            {message.embeds?.map((embed, index) => (
              <div
                key={index}
                className="border-l-4 rounded bg-[#2f3136] p-4"
                style={{ borderColor: `#${(embed.color || 0).toString(16).padStart(6, '0')}` }}
              >
                {embed.title && <div className="font-bold mb-2">{embed.title}</div>}
                {embed.description && <div className="whitespace-pre-wrap">{embed.description}</div>}
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-white">Raw JSON</h2>
          <pre className="bg-[#40444b] text-gray-300 p-4 rounded overflow-auto">
            {JSON.stringify(message, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}