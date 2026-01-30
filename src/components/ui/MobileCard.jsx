import React from "react";
import { cn } from "@/lib/utils";

const MobileCard = React.forwardRef(function MobileCard(
  { children, className, onClick, ...props },
  ref
) {
  const clickable = typeof onClick === "function";

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl p-4 border border-slate-100 shadow-sm",
        clickable && "cursor-pointer active:bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export default MobileCard;
