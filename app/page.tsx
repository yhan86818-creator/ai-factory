"use client";

import React, { useState } from 'react';
import { 
  Edit3, FileText, Lightbulb, Code, Mail, 
  Presentation, MessageSquare, Users, Calendar, Languages,
  Send, Copy, Loader2 
} from 'lucide-react';

// 1. ツールの定義データ（ここを増やすだけでアプリが増えます）
const TOOLS = [
  { id: 'rewrite', name: '文章リライト', icon: Edit3, desc: '文章を読みやすく洗練させます', prompt: '以下の文章を自然で読みやすい表現にリライトしてください：' },
  { id: 'summary', name: '要約ツール', icon: FileText, desc: '長い文章を要約してポイントを抽出', prompt: '以下の文章の要旨を3点にまとめてください：' },
  { id: 'idea', name: 'アイデア出しAI', icon: Lightbulb, desc: '新しい企画や切り口を提案', prompt: '以下のテーマに基づいて、斬新なアイデアを5つ提案してください：' },
  { id: 'script', name: 'スクリプト生成', icon: Code, desc: '動画や演劇の台本を自動作成', prompt: '以下の設定で、魅力的な動画台本を作成してください：' },
  { id: 'mail', name: 'メール自動作成', icon: Mail, desc: '状況に応じたビジネスメールを作成', prompt: '以下の要件を満たす、丁寧なビジネスメールを作成してください：' },
  { id: 'presen', name: 'プレゼン作成AI', icon: Presentation, desc: 'スライド構成と発表原稿を提案', prompt: '以下のテーマで、10分間のプレゼン構成案と各スライドの要点を作成してください：' },
  { id: 'chat', name: '会話練習AI', icon: MessageSquare, desc: '日常会話や雑談の練習', prompt: '以下の状況を想定して、自然な会話のキャッチボールをシミュレーションしてください：' },
  { id: 'interview', name: '面接対策AI', icon: Users, desc: '想定質問と模範解答を生成', prompt: '志望動機が以下の内容の場合、面接官が深掘りしそうな質問3つと回答案を作成してください：' },
  { id: 'study', name: '勉強計画AI', icon: Calendar, desc: '目標に合わせた学習スケジュール', prompt: '試験日まで残り30日の場合、以下の内容をマスターするための効率的な学習計画を作成してください：' },
  { id: 'translate', name: '翻訳＋自然化', icon: Languages, desc: '自然なニュアンスで多言語翻訳', prompt: '以下の文章を、現地の人が使うような自然な表現で翻訳してください：' },
];

export default function AIFactory() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!input) return;
    setIsLoading(true);
    // 擬似的な生成待ち時間
    setTimeout(() => {
      setOutput(`【${activeTool.name}の結果】\n\nこれは「${activeTool.name}」のデモ表示です。現在はプロトタイプのため、実際のAPI連携は行っていませんが、UIの反応を確認できます。\n\n入力された内容: ${input.substring(0, 30)}...`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* サイドバー */}
      <aside className="w-64 bg-white border-r overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Multi Tool
          </h1>
        </div>
        <nav className="px-3 pb-4">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool); setOutput(''); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                activeTool.id === tool.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tool.icon size={18} />
              {tool.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* ヘッダーセクション */}
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <activeTool.icon className="text-blue-600" />
              {activeTool.name}
            </h2>
            <p className="text-gray-500 mt-1">{activeTool.desc}</p>
          </div>

          {/* 入力エリア */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <label className="block text-sm font-medium mb-2 text-gray-700">入力を開始</label>
            <textarea
              className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder={`${activeTool.name}したい内容を入力してください...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400">{input.length} 文字</span>
              <button
                onClick={handleGenerate}
                disabled={isLoading || !input}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                実行する
              </button>
            </div>
          </div>

          {/* 出力エリア */}
          { (output || isLoading) && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-blue-800">生成結果</h3>
                <button 
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm"
                >
                  <Copy size={14} /> コピー
                </button>
              </div>
              <div className="whitespace-pre-wrap text-gray-700 min-h-[100px]">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="animate-pulse">AIが考え中...</span>
                  </div>
                ) : output}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}