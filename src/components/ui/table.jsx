import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef(function Table({ className, ...props }, ref) {
  return (
    <div className="w-full overflow-auto">
      <table ref={ref} className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
});
Table.displayName = "Table";

const TableHeader = React.forwardRef(function TableHeader(props, ref) {
  return <thead ref={ref} {...props} />;
});
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(function TableBody(props, ref) {
  return <tbody ref={ref} {...props} />;
});
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(function TableFooter({ className, ...props }, ref) {
  return <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium", className)} {...props} />;
});
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(function TableRow({ className, ...props }, ref) {
  return <tr ref={ref} className={cn("border-b hover:bg-muted/50", className)} {...props} />;
});
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(function TableHead({ className, ...props }, ref) {
  return <th ref={ref} className={cn("px-2 py-1 text-left font-medium", className)} {...props} />;
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(function TableCell({ className, ...props }, ref) {
  return <td ref={ref} className={cn("p-2", className)} {...props} />;
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(function TableCaption({ className, ...props }, ref) {
  return <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />;
});
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
