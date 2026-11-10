"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LoginPromptModal({
  open,
  onOpenChange,
  onProceed,
  title = "Login required",
  description = "Please log in to save captions. You will be redirected to the login page.",
  confirmText = "Log in",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hover:bg-[#9c9793]"
            style={{ backgroundColor: "#a49f9b", color: "black" }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onProceed}
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/30"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

