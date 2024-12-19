"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDepartment } from "@/lib/actions/department.actions";
import Image from "next/image";

interface CreateDepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDepartmentDialog: React.FC<CreateDepartmentDialogProps> = ({ isOpen, onClose }) => {
  const [departmentName, setDepartmentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!departmentName.trim()) {
      setError("Department name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newDepartment = await createDepartment({ department: departmentName });

      if (newDepartment) {
        alert("Department created successfully!");
        setDepartmentName("");
        onClose(); // Close the dialog
      }
    } catch (err) {
      console.error("Error creating department:", err);
      setError("Failed to create department. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="shad-dialog button">
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter department name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter className="flex flex-col gap-3 md:flex-row">
          <Button onClick={onClose} className="modal-cancel-button">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading} className="modal-submit-button">
            {isLoading ? (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin"
              />
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentDialog;
