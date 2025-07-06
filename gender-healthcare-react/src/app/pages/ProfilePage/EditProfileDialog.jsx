import { useState, useEffect } from "react";
import { Button } from "../../components/ForumComponents/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "../../components/ForumComponents/ui/input";
import { Label } from "../../components/ForumComponents/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ForumComponents/ui/select";
import accountAPI from "../../services/accountAPI";

export default function EditProfileDialog({ isOpen, onClose, userInfo, customerInfo, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    dateOfBirth: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        gender: userInfo.gender || "",
        address: customerInfo?.address || "",
        dateOfBirth: customerInfo?.dateOfBirth ? 
          new Date(customerInfo.dateOfBirth).toISOString().split('T')[0] : ""
      });
    }
  }, [userInfo, customerInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Update user account information
      const accountData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender
      };
      
      await accountAPI.updateProfile(userInfo._id, accountData);
      
      // If customer info exists and there's customer data to update
      if (customerInfo && (formData.address || formData.dateOfBirth)) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        await fetch(`${API_URL}/customers/${customerInfo._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: formData.address,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined
          })
        });
      }
      
      // Notify parent component that profile was updated
      if (onProfileUpdated) {
        onProfileUpdated();
      }
      
      // Close dialog
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 shadow-lg max-w-[500px] w-full max-h-[85vh] overflow-y-auto focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="mb-4">
            <Dialog.Title className="text-lg font-semibold">Edit Profile</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mt-1">
              Update your personal information below.
            </Dialog.Description>
          </div>
        
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
        
        <Dialog.Close asChild>
          <button className="absolute right-4 top-4 opacity-70 hover:opacity-100 focus:outline-none" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
