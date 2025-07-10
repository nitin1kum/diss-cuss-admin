"use client";
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { X, Camera, Loader } from "lucide-react";

interface FormData {
  name: string;
  bio: string;
  profileImage: string;
  newImage?: File;
  private : boolean;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; bio: string; profileImage: string,newImage? : File,private:boolean }) => Promise<void>;
  initialData: FormData;
  loading: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading,
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    onSave(formData);
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!loading && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const imageData = new FormData();
      imageData.append("image", file);
      const url = window.URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        newImage: file,
        profileImage: url,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-scroll">
      <div className="w-full min-h-[550px] h-screen flex justify-center items-center relative p-4">
        {/* Backdrop */}
        <div
          className={`${loading && "cursor-wait"} absolute inset-0 bg-black/60 backdrop-blur-sm min-h-[550px] animate-fade-in`}
          onClick={() => {
            if (!loading) onClose();
          }}
        />

        {/* Modal */}
        <div className="relative w-full overflow-scroll max-w-md bg-card rounded-md shadow-2xl animate-scale-in border border-border">
          {/* Header */}
          <div className="flex relative items-center justify-center p-2 border-b border-border">
            <h2 className="text-3xl  font-semibold text-text m-0 py-2">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className={`${
                loading && "cursor-wait"
              } w-8 h-8 absolute right-4 text-subtext ring-border-secondary ring-1 flex items-center justify-center rounded-full hover:text-text transition-colors focus-ring`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-border"
                />
                {loading && (
                  <div className="absolute inset-0 z-40 bg-black/70 flex justify-center items-center rounded-full">
                    <Loader className="animate-spin size-6 text-white" />
                  </div>
                )}
                <button
                  disabled={loading}
                  type="button"
                  tabIndex={0}
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                  className="absolute -bottom-2 -right-2 z-50 w-8 h-8 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center shadow-lg transition-colors focus-ring"
                >
                  <Camera className="w-4 h-4 text-black" />
                </button>
                <input
                  id="profile-image"
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-sm text-subtext">
                Click camera icon to change photo
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-border-secondary px-4 py-3 bg-bg outline-none rounded-lg text-text placeholder-subtext transition-all duration-200"
                placeholder="Enter your name"
              />
            </div>

            {/* Bio Textarea */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-text mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 bg-bg border border-border-secondary rounded-lg outline-none text-subtext placeholder-subtext transition-all duration-200 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Private Checkbox */}
            <div className="flex items-center gap-4">
              <input
                id="private"
                checked={formData.private}
                type="checkbox"
                onChange={(e) =>
                  setFormData({ ...formData, private: e.target.checked })
                }
                className="cursor-pointer"
              />
              <label
                htmlFor="private"
                className="block text-sm font-medium text-text"
              >
                Private profile (Hide activity)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className={` ${
                  loading && "cursor-not-allowed"
                } flex-1 px-4 py-3 border border-border text-subtext rounded-lg hover:bg-bg transition-colors focus-ring`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-accent hover:bg-highlight text-black rounded-lg transition-colors focus-ring"
              >
                {loading ? (
                  <Loader className="animate-spin text-black" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
