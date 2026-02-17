import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CheckCircle, Clock, AlertTriangle, Users, ArrowRightIcon } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#71717a"];

const PRIORITY_STYLES = {
    LOW: "text-zinc-500 bg-zinc-200 dark:text-zinc-400 dark:bg-zinc-800",
    MEDIUM: "text-blue-600 bg-blue-200 dark:text-blue-400 dark:bg-blue-900/30",
    HIGH: "text-orange-600 bg-orange-200 dark:text-orange-400 dark:bg-orange-900/30",
    CRITICAL: "text-red-600 bg-red-200 dark:text-red-400 dark:bg-red-900/30",
};

const PROGRESS_BAR_COLORS = {
    LOW: "bg-zinc-500 dark:bg-zinc-400",
    MEDIUM: "bg-blue-600 dark:bg-blue-500",
    HIGH: "bg-orange-600 dark:bg-orange-500",
    CRITICAL: "bg-red-600 dark:bg-red-500",
};

const ProjectAnalytics = ({ project, tasks }) => {
    const { stats, statusData, typeData, priorityData } = useMemo(() => {
        const now = new Date();
        const total = tasks.length;

        const stats = {
            total,
            completed: 0,
            active: 0,
            overdue: 0,
        };

        // Initialize maps based on your new Schema Enums
        const statusMap = {
            NEW: 0, REVIEW: 0, READY: 0, WORK_IN_PROGRESS: 0,
            PEER_REVIEW: 0, TESTING: 0, READY_FOR_DEPLOYMENT: 0, COMPLETED: 0
        };
        const typeMap = { MAINTENANCE: 0, FEATURE: 0, PRODUCTION_ISSUE: 0 };
        const priorityMap = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };

        tasks.forEach((t) => {
            // Stats logic
            if (t.status === "COMPLETED") stats.completed++;
            if (t.status !== "COMPLETED") stats.active++;
            if (t.due_date && new Date(t.due_date) < now && t.status !== "COMPLETED") stats.overdue++;

            // Counter logic
            if (statusMap[t.status] !== undefined) statusMap[t.status]++;
            if (typeMap[t.type] !== undefined) typeMap[t.type]++;
            if (priorityMap[t.priority] !== undefined) priorityMap[t.priority]++;
        });

        return {
            stats,
            statusData: Object.entries(statusMap).map(([k, v]) => ({ 
                name: k.replace(/_/g, " "), 
                value: v 
            })),
            typeData: Object.entries(typeMap).filter(([_, v]) => v > 0).map(([k, v]) => ({ 
                name: k.replace(/_/g, " "), 
                value: v 
            })),
            priorityData: Object.entries(priorityMap).map(([k, v]) => ({
                name: k,
                value: v,
                percentage: total > 0 ? Math.round((v / total) * 100) : 0,
            })),
        };
    }, [tasks]);

    const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

    const metrics = [
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            color: "text-emerald-600 dark:text-emerald-400",
            icon: <CheckCircle className="size-5" />,
            bg: "bg-emerald-100 dark:bg-emerald-500/10",
        },
        {
            label: "Active",
            value: stats.active,
            color: "text-amber-600 dark:text-amber-400",
            icon: <Clock className="size-5" />,
            bg: "bg-amber-100 dark:bg-amber-500/10",
        },
        {
            label: "Overdue",
            value: stats.overdue,
            color: "text-red-600 dark:text-red-400",
            icon: <AlertTriangle className="size-5" />,
            bg: "bg-red-100 dark:bg-red-500/10",
        },
        {
            label: "Contributors",
            value: project?.members?.length || 0,
            color: "text-purple-600 dark:text-purple-400",
            icon: <Users className="size-5" />,
            bg: "bg-purple-100 dark:bg-purple-500/10",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">{m.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${m.bg} ${m.color}`}>{m.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Status Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-6">Workflow Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData} layout="vertical" margin={{ left: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    tick={{ fill: "#71717a", fontSize: 10 }}
                                    width={100}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '12px' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Type Pie Chart */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-6">Task Categories</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                >
                                    {typeData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                            {typeData.map((entry, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Priority Progress Bars */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-6">Priority Breakdown</h3>
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                    {priorityData.map((p) => (
                        <div key={p.name} className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-tighter ${PRIORITY_STYLES[p.name]}`}>
                                    {p.name}
                                </span>
                                <span className="text-zinc-500 font-medium">{p.value} tasks ({p.percentage}%)</span>
                            </div>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-700 ease-out rounded-full ${PROGRESS_BAR_COLORS[p.name]}`}
                                    style={{ width: `${p.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalytics;