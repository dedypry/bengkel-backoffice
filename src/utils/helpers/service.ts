export const statusServiceColor = (difficulty: string) => {
  const colors = {
    easy: {
      themeColor: "bg-emerald-500",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
      hover: "group-hover:text-emerald-600",
      border: "hover:border-emerald-600",
    },
    medium: {
      themeColor: "bg-cyan-500",
      lightBg: "bg-cyan-50",
      textColor: "text-cyan-600",
      hover: "group-hover:text-cyan-600",
      border: "hover:border-cyan-600",
    },
    hard: {
      themeColor: "bg-amber-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-500",
      hover: "group-hover:text-amber-500",
      border: "hover:border-amber-500",
    },
    extreme: {
      themeColor: "bg-red-700",
      lightBg: "bg-red-50",
      textColor: "text-red-700",
      hover: "group-hover:text-red-700",
      border: "hover:border-red-700",
    },
  };

  const key = difficulty?.toLowerCase() as keyof typeof colors;

  return colors[key] || colors.medium;
};
