"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate: (d?: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:border-emerald-600 transition-all duration-150",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d);
            setOpen(false);
          }}
          initialFocus
          classNames={{
            root: "border border-emerald-600 rounded-md",
          }}
          components={{
            DayButton: ({ className, ...props }) => {
              return (
                <CalendarDayButton
                  {...props}
                  className={cn(
                    className,
                    "border border-transparent transition-all duration-150",
                    "data-[selected-single=true]:border-emerald-600",
                    "hover:border-emerald-600",
                    "outiline:none",
                  )}
                />
              );
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
