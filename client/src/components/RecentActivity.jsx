import { useEffect, useState } from "react";
import { Clock,  Zap, Square, Wrench, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const typeIcons = {
    MAINTENANCE: { icon: Wrench, color: "text-slate-600 dark:text-slate-400" },
    FEATURE: { icon: Zap, color: "text-blue-600 dark:text-blue-400" },
    PRODUCTION_ISSUE: { icon: AlertCircle, color: "text-red-600 dark:text-red-400" },
};

const getTaskStatusColor = (status) => {
        switch (status) {
            case 'NEW':
                return 'bg-slate-400 dark:bg-zinc-500';
            case 'WORK_IN_PROGRESS':
                return 'bg-amber-500';
            case 'REVIEW':
            case 'PEER_REVIEW':
                return 'bg-purple-500';
            case 'TESTING':
                return 'bg-orange-500';
            case 'READY':
            case 'READY_FOR_DEPLOYMENT':
                return 'bg-blue-500';
            case 'COMPLETED':
                return 'bg-emerald-500';
            default:
                return 'bg-gray-400';
        }
    };

const RecentActivity = () => {
    const [tasks, setTasks] = useState([]);
    const { currentWorkspace } = useSelector((state) => state.workspace);

    const getTasksFromCurrentWorkspace = () => {

        if (!currentWorkspace) return;

        const tasks = currentWorkspace.projects.flatMap((project) => project.tasks.map((task) => task));
        setTasks(tasks);
    };

    useEffect(() => {
        getTasksFromCurrentWorkspace();
    }, [currentWorkspace]);

    return (
        <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg transition-all overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
                <h2 className="text-lg text-zinc-800 dark:text-zinc-200">Recent Activity</h2>
            </div>

            <div className="p-0">
                {tasks.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-zinc-600 dark:text-zinc-500" />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">No recent activity</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {tasks.map((task) => {
                            const TypeIcon = typeIcons[task.type]?.icon || Square;
                            const iconColor = typeIcons[task.type]?.color || "text-gray-500 dark:text-gray-400";

                            return (
                                <div key={task.id} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                                            <TypeIcon className={`w-4 h-4 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-zinc-800 dark:text-zinc-200 truncate">
                                                    {task.title}
                                                </h4>
                                                <span className={`ml-2 px-2 py-1 rounded text-xs ${getTaskStatusColor(task.status)} || "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"}`}>
                                                    {task.status.replaceAll("_", " ")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                                <span className="capitalize">{task.type.replace("_", " ")}</span>
                                                {task.assignee && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-4 h-4 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center justify-center text-[10px] text-zinc-800 dark:text-zinc-200">
                                                            {task.assignee.name[0].toUpperCase()}
                                                        </div>
                                                        {task.assignee.name}
                                                    </div>
                                                )}
                                                <span>
                                                    {format(new Date(task.updatedAt), "MMM d, h:mm a")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
