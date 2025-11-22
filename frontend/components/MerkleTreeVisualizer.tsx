'use client';

import { GlassCard } from './GlassCard';
import { motion } from 'framer-motion';

// Mock Merkle Tree Data
const TREE_LEVELS = [
    // Root
    [{ hash: '0xRoot...', sum: '1,180,000', type: 'root' }],
    // Level 1
    [
        { hash: '0xAb1...', sum: '500,000', type: 'node' },
        { hash: '0xCd2...', sum: '680,000', type: 'node' }
    ],
    // Level 2
    [
        { hash: '0xEf3...', sum: '200,000', type: 'node' },
        { hash: '0xGh4...', sum: '300,000', type: 'node' },
        { hash: '0xIj5...', sum: '300,000', type: 'node' },
        { hash: '0xKl6...', sum: '380,000', type: 'node' }
    ],
    // Leaves (Users)
    [
        { hash: '0xUser1...', sum: '100,000', type: 'leaf' },
        { hash: '0xUser2...', sum: '100,000', type: 'leaf' },
        { hash: '0xUser3...', sum: '150,000', type: 'leaf' },
        { hash: '0xUser4...', sum: '150,000', type: 'leaf' },
        { hash: '0xUser5...', sum: '150,000', type: 'leaf' },
        { hash: '0xUser6...', sum: '150,000', type: 'leaf' },
        { hash: '0xUser7...', sum: '190,000', type: 'leaf' },
        { hash: '0xUser8...', sum: '190,000', type: 'leaf' }
    ]
];

export function MerkleTreeVisualizer() {
    return (
        <div className="overflow-x-auto pb-12">
            <div className="min-w-[800px] flex flex-col items-center gap-12 py-8">
                {TREE_LEVELS.map((level, levelIndex) => (
                    <div key={levelIndex} className="flex justify-center gap-8 w-full">
                        {level.map((node, nodeIndex) => (
                            <motion.div
                                key={`${levelIndex}-${nodeIndex}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: levelIndex * 0.2 + nodeIndex * 0.05 }}
                                className="relative"
                            >
                                {/* Connector Line (except for root) */}
                                {levelIndex > 0 && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
                                )}

                                <GlassCard
                                    className={`p-3 min-w-[120px] text-center border ${node.type === 'root' ? 'border-blue-500/50 bg-blue-500/10' :
                                            node.type === 'leaf' ? 'border-green-500/30 bg-green-500/5' :
                                                'border-white/10'
                                        }`}
                                >
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                                        {node.type === 'root' ? 'Merkle Root' : node.type === 'leaf' ? 'User Leaf' : 'Node'}
                                    </div>
                                    <div className="font-mono text-xs text-gray-300 mb-1 truncate max-w-[100px] mx-auto">
                                        {node.hash}
                                    </div>
                                    <div className={`text-sm font-bold ${node.type === 'root' ? 'text-blue-400' : 'text-gray-200'
                                        }`}>
                                        ${node.sum}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
