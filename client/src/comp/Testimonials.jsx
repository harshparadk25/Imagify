import React, { useContext, useEffect, useState } from 'react';
import { assets, testimonialsData } from '../assets/assets';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Testimonials = () => {
  const { backendURL = '', token, user } = useContext(AppContext);

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);

  const authHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

  const ownerIdOf = (comment) => {
    const u = comment?.user;
    if (!u) return null;
    if (typeof u === 'string') return u;
    return u._id || u.id || (u.toString ? u.toString() : null);
  };

  const currentUserId = user?._id || user?.id || user?.userId || null;

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendURL}/api/comments`, {
        headers: authHeaders()
      });

      if (Array.isArray(data)) {
        setComments(data);
      } else if (data?.success && Array.isArray(data?.comments)) {
        setComments(data.comments);
      } else {
        const arrField = ['comments', 'testimonials', 'data', 'results'].find(k => Array.isArray(data?.[k]));
        if (arrField) setComments(data[arrField]);
        else if (data && (data._id || data.id)) setComments([data]);
        else setComments([]);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      toast.error('Failed to fetch comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    
  }, []);

  const addComment = async () => {
    if (!token) {
      toast.error('Please login to add a comment.');
      return;
    }
    if (!message || message.trim().length < 3) {
      toast.error('Please enter a message (3+ chars).');
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5.');
      return;
    }

    try {
      setPosting(true);
      const payload = { content: message.trim(), rating };
      const { data } = await axios.post(`${backendURL}/api/comments`, payload, {
        headers: { ...authHeaders(), 'Content-Type': 'application/json' }
      });

      const created = data?.comment || data || (data?.data && data.data) || null;

      if (created && (created._id || created.id)) {
        setComments(prev => [created, ...prev]);
        setMessage('');
        setRating(5);
        toast.success('Comment added!');
      } else {
        toast.error('Unexpected response adding comment.');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      const serverMsg = err?.response?.data?.message || err?.message;
      toast.error(serverMsg || 'Failed to add comment.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center my-24 py-12"
    >
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Customer Testimonials</h1>
      <p className="text-gray-500 mb-8">Hear what our satisfied users have to say about Imagify AI.</p>

      <div className="flex flex-wrap gap-6 mb-10">
        {testimonialsData.map((t, idx) => (
          <div key={idx} className="bg-white/20 p-8 rounded-lg shadow-md w-80 m-auto hover:scale-[1.02] transition-all">
            <div className="flex flex-col items-center">
              <img src={t.image} alt={t.name} className="rounded-full w-14" />
              <h2 className="text-xl font-semibold mt-3">{t.name}</h2>
              <p className="mb-4 text-gray-500">{t.role}</p>
              <div className="flex mb-4">
                {Array(t.stars).fill().map((_, i) => <img key={i} src={assets.rating_star} alt="star" />)}
              </div>
              <p className="text-center text-sm text-gray-600">{t.text}</p>
            </div>
          </div>
        ))}
      </div>

      
      <div className="w-full max-w-4xl px-4">
        <div className="bg-white/5 p-6 rounded-lg mb-4 shadow-lg">
          <h3 className="text-lg font-medium mb-2">Leave a comment</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your experience..."
            className="w-full p-3 rounded-md mb-3 bg-white/10 resize-none min-h-20"
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Rating:</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="px-2 py-1 rounded">
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={addComment}
                className="bg-zinc-800 text-white px-4 py-2 rounded-md hover:opacity-90"
                disabled={!token || posting}
              >
                {posting ? 'Posting...' : 'Post Comment'}
              </button>
              {!token && <p className="text-sm text-red-400">Login to post</p>}
            </div>
          </div>
        </div>

      
        <div
          className="bg-white/6 rounded-lg shadow-lg p-4"
          aria-live="polite"
        >
          <div
            className="max-h-[420px] overflow-y-auto space-y-3 pr-2 scrollbar-hide"
            style={{ scrollbarGutter: 'stable' }}
          >
            {loading && <p className="text-center">Loading comments...</p>}
            {!loading && comments.length === 0 && (
              <p className="text-center text-gray-500">No comments yet — be the first!</p>
            )}

            {comments.map((c) => {
              const id = c._id || c.id;
              const ownerId = ownerIdOf(c);

              return (
                <div
                  key={id}
                  className="bg-white/5 p-4 rounded-md flex gap-4 items-start wrap-break-word"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-sm font-semibold shrink-0">
                    {c.user?.name?.[0] || c.user?.username?.[0] || (ownerId ? ownerId.toString().slice(-4) : '?')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-medium text-sm truncate">
                        {c.user?.name || c.user?.username || c.user?.email || 'Anonymous'}
                      </div>
                      <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                    </div>

                    <div className="text-sm text-gray-800 mt-2 overflow-hidden">
                      
                      <p className="wrap-break-word whitespace-pre-wrap">{c.content || c.message || c.text}</p>
                    </div>

                    <div className="mt-2 text-yellow-400 text-sm">
                      {'★'.repeat(c.rating || 0)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonials;