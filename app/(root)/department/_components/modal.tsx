import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { createDepartment } from "@/lib/actions/department.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const CreateDepartmentForm = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      setError("Department name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const path = router.asPath;
      const newDepartment = await createDepartment({ name: departmentName, path });

      if (newDepartment) {
        setDepartmentName("");
        alert("Department created successfully!");
        router.replace(router.asPath);
      }
    } catch (error) {
      setError("Failed to create department. Please try again.");
      console.error("Error creating department:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">Create a new department</p>
        <Input
          type="text"
          placeholder="Enter department name"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className="share-input-field"
        />
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="share-button"
          >
            {isLoading ? "Creating..." : "Create Department"}
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default CreateDepartmentForm;
