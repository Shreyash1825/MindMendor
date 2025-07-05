import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Predictor = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", { text });
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error connecting to the server");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1120] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900 shadow-xl rounded-xl p-8 max-w-xl w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Sentiment Analyzer 🧠
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="text"
            placeholder="Type something like: How was your day?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            className="w-full p-4 border rounded-lg bg-gray-800 text-white shadow-sm focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:opacity-90 transition"
          >
            {loading ? "Analyzing..." : "Predict Sentiment"}
          </motion.button>
        </form>

        {result && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-lg font-semibold text-gray-300"
          >
            Result:{" "}
            <span
              className={`${
                result.toLowerCase().includes("negative")
                  ? "text-red-500"
                  : result.toLowerCase().includes("positive")
                  ? "text-green-500"
                  : "text-yellow-400"
              }`}
            >
              {result}
            </span>
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Predictor;