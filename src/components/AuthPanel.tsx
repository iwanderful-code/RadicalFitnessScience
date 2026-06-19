import React, { useState } from "react";
import { Shield } from "lucide-react";
import { useCommando } from "../context/CommandoContext";

export default function AuthPanel() {
  const { signup, login } = useCommando();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter email and password coordinates.");
      return;
    }

    if (isSignUp) {
      const success = signup(email, password);
      if (!success) {
        setErrorMsg("Operational account coordinates already exist. Try signing in.");
      }
    } else {
      const success = login(email, password);
      if (!success) {
        setErrorMsg("Invalid authorization parameters. Access denied.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(255,95,21,0.15)] font-mono text-xs">
      <div className="flex flex-col items-center mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#FF5F15]/10 border border-[#FF5F15]/30 flex items-center justify-center text-[#FF5F15] mb-3">
          <Shield className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-black text-white uppercase tracking-wider text-center">
          {isSignUp ? "Create Tactical Profile" : "Enlist System Portal"}
        </h2>
        <p className="text-[10px] text-zinc-500 uppercase mt-1 tracking-widest">
          Secure Cellular Node Authorization
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[9px] font-mono text-zinc-450 uppercase font-black block mb-1">
            Email Coordinates
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="candidate@radical.io"
            className="w-full bg-zinc-950 border border-white/10 text-xs font-mono text-zinc-200 rounded-lg p-2.5 focus:outline-none focus:border-[#FF5F15]"
          />
        </div>

        <div>
          <label className="text-[9px] font-mono text-zinc-450 uppercase font-black block mb-1">
            Passkey Signature
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-zinc-950 border border-white/10 text-xs font-mono text-zinc-200 rounded-lg p-2.5 focus:outline-none focus:border-[#FF5F15]"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] rounded-lg">
            ⚠ {errorMsg}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#FF5F15] hover:bg-orange-600 text-black font-black py-2.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer text-center"
        >
          {isSignUp ? "Establish Account" : "Verify Passkey"}
        </button>
      </form>

      {/* Social Sign Up / Sign In Divider */}
      <div className="my-6 flex items-center justify-between text-zinc-600">
        <span className="w-1/3 border-b border-white/5"></span>
        <span className="text-[9px] uppercase tracking-wider text-zinc-550 font-bold px-2">OR PROTOCOL</span>
        <span className="w-1/3 border-b border-white/5"></span>
      </div>

      {/* Social Buttons */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            signup("google.candidate@gmail.com", "google-oauth-radical");
          }}
          className="w-full flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-white font-mono py-2 rounded-lg transition-all uppercase cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.694 0-8.503-3.809-8.503-8.5s3.81-8.5 8.503-8.5c2.25 0 4.18.87 5.66 2.28l3.255-3.255C18.42 1.62 15.6 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.91 0 12.24-4.87 12.24-12.24 0-.825-.075-1.62-.21-2.385H12.24z"/>
          </svg>
          Google Auth Node
        </button>

        <button
          type="button"
          onClick={() => {
            signup("apple.candidate@icloud.com", "apple-oauth-radical");
          }}
          className="w-full flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-white font-mono py-2 rounded-lg transition-all uppercase cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.98 1.12.09 2.27-.56 2.98-1.42z"/>
          </svg>
          Apple Sign In
        </button>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMsg(null);
          }}
          className="text-[10px] text-zinc-400 hover:text-[#FF5F15] hover:underline uppercase bg-transparent border-none p-0 cursor-pointer"
        >
          {isSignUp ? "Already Enlisted? Sign In" : "Need Coordinates? Sign Up"}
        </button>
      </div>
    </div>
  );
}
