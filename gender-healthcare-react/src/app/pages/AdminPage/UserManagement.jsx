import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '../../components/ForumComponents/ui/button';
import { Input } from '../../components/ForumComponents/ui/input';
import { Card, CardContent } from '../../components/ForumComponents/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../../components/ForumComponents/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ForumComponents/ui/table';
import { Badge } from '../../components/ForumComponents/ui/badge';
import * as Dialog from "@radix-ui/react-dialog";
import { Switch } from '../../components/ForumComponents/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ForumComponents/ui/select';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ForumComponents/ui/dialog';
import accountAPI from '../../services/accountAPI';
import { medicalfacilitiesAPI, doctorAPI, counselorAPI } from '../../services/api';

// User Edit Modal Component
const UserEditModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    isActive: true,
    // Additional fields for Counselor
    degree: '',
    experience: '',
    bio: '',
    // Additional fields for Doctor
    phone: '',
    avatar: '',
    medicalfacilityId: ''
  });

  // Fetch medical facilities for doctor role
  const [medicalFacilities, setMedicalFacilities] = useState([]);
  
  useEffect(() => {
    // If role is Doctor, fetch medical facilities
    if (formData.role === 'Doctor') {
      const fetchMedicalFacilities = async () => {
        try {
          // Using the API client to fetch medical facilities
          const response = await medicalfacilitiesAPI.getAll();
          console.log('Medical facilities data:', response.data);
          if (response.data) {
            setMedicalFacilities(response.data);
          }
        } catch (error) {
          console.error('Error fetching medical facilities:', error);
        }
      };
      
      fetchMedicalFacilities();
    }
  }, [formData.role]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        // Set base user data
        const baseUserData = {
          name: user.name || '',
          email: user.email || '',
          password: '',  // Clear password field on edit
          role: user.role || 'Customer',
          isActive: user.isActive !== false, // default to true if not specified
          degree: '',
          experience: '',
          bio: '',
          phone: '',
          avatar: '',
          medicalfacilityId: ''
        };
        
        // If user is a Counselor, load their counselor profile
        if (user.role === 'Counselor') {
          try {
            const response = await counselorAPI.getAll();
            console.log('Counselor data:', response.data);
           const counselorData = response.data.find(c => c.accountId && c.accountId._id === user._id);
          
            
            if (counselorData) {
              baseUserData.degree = counselorData.degree || '';
              baseUserData.experience = counselorData.experience || '';
              baseUserData.bio = counselorData.bio || '';
            }
          } catch (error) {
            console.error('Error loading counselor data:', error);
          }
        }
        
        // If user is a Doctor, load their doctor profile
        if (user.role === 'Doctor') {
          try {
            const response = await doctorAPI.getAll();
            const doctorData = response.data.find(d => d.accountId === user._id);
            
            if (doctorData) {
              baseUserData.degree = doctorData.degree || '';
              baseUserData.experience = doctorData.experience || '';
              baseUserData.bio = doctorData.bio || '';
              baseUserData.phone = doctorData.phone || '';
              baseUserData.avatar = doctorData.avatar || '';
              baseUserData.medicalfacilityId = doctorData.medicalfacilityId || '';
            }
          } catch (error) {
            console.error('Error loading doctor data:', error);
          }
        }
        
        setFormData(baseUserData);
      } else {
        // Reset form for new user
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'Customer',
          isActive: true,
          degree: '',
          experience: '',
          bio: '',
          phone: '',
          avatar: '',
          medicalfacilityId: ''
        });
      }
    };
    
    loadUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data based on role
    const userData = { ...formData };
    
    // For Counselor role, include specific fields
    if (userData.role === 'Counselor') {
      userData.counselorData = {
        degree: userData.degree,
        experience: userData.experience,
        bio: userData.bio
      };
    }
    
    // For Doctor role, include specific fields
    if (userData.role === 'Doctor') {
      userData.doctorData = {
        degree: userData.degree,
        experience: userData.experience,
        bio: userData.bio,
        phone: userData.phone,
        avatar: userData.avatar,
        medicalfacilityId: userData.medicalfacilityId
      };
    }
    
    onSave(user?._id, userData);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 shadow-lg max-w-[425px] w-full max-h-[85vh] overflow-y-auto focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="mb-4">
            <Dialog.Title className="text-lg font-semibold">{user ? 'Edit User' : 'Create New User'}</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mt-1">
              {user ? 'Update user details' : 'Enter information for the new user'}
            </Dialog.Description>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange}
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {user ? 'Password (leave empty to keep current)' : 'Password'}
              </label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange}
                placeholder="••••••••"
                required={!user} // Only required for new users
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Select 
                name="role" 
                value={formData.role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Counselor">Counselor</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Conditional fields for Counselor role */}
            {formData.role === 'Counselor' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="degree" className="text-sm font-medium">Degree</label>
                  <Input 
                    id="degree" 
                    name="degree" 
                    value={formData.degree} 
                    onChange={handleChange}
                    placeholder="Academic Degree"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium">Experience (Years)</label>
                  <Input 
                    id="experience" 
                    name="experience" 
                    type="number" 
                    value={formData.experience} 
                    onChange={handleChange}
                    placeholder="Years of Experience"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">Biography</label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Professional bio and specialties"
                  />
                </div>
              </>
            )}
            
            {/* Conditional fields for Doctor role */}
            {formData.role === 'Doctor' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="degree" className="text-sm font-medium">Degree</label>
                  <Input 
                    id="degree" 
                    name="degree" 
                    value={formData.degree} 
                    onChange={handleChange}
                    placeholder="Medical Degree"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium">Experience</label>
                  <Input 
                    id="experience" 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleChange}
                    placeholder="Years of Practice"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="Contact Number"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">Biography</label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange}
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Professional bio and specialties"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="avatar" className="text-sm font-medium">Avatar URL</label>
                  <Input 
                    id="avatar" 
                    name="avatar" 
                    value={formData.avatar} 
                    onChange={handleChange}
                    placeholder="Profile Image URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="medicalfacilityId" className="text-sm font-medium">Medical Facility</label>
                  <Select 
                    name="medicalfacilityId" 
                    value={formData.medicalfacilityId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, medicalfacilityId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a medical facility" />
                    </SelectTrigger>
                   <SelectContent>
                    {medicalFacilities.length === 0 ? (
                      <SelectItem value="no-facilities">No facilities found</SelectItem>
                    ) : (
                      medicalFacilities.map(facility => (
                        <SelectItem key={facility._id} value={facility._id}>
                          {facility.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {/* <div className="flex items-center justify-between">
              <label htmlFor="isActive" className="text-sm font-medium">Active Status</label>
              <Switch 
                id="isActive" 
                checked={formData.isActive} 
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))
                }
              />
            </div> */}
          
            {/* Additional fields for Counselor role */}
            {/* {formData.role === 'Counselor' && (
              <div className="space-y-2">
                <label htmlFor="degree" className="text-sm font-medium">Degree</label>
                <Input 
                  id="degree" 
                  name="degree" 
                  value={formData.degree} 
                  onChange={handleChange}
                  placeholder="e.g. Master of Psychology"
                />
                
                <label htmlFor="experience" className="text-sm font-medium">Experience (years)</label>
                <Input 
                  id="experience" 
                  name="experience" 
                  type="number" 
                  value={formData.experience} 
                  onChange={handleChange}
                  placeholder="e.g. 5"
                />
                
                <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                <Input 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange}
                  placeholder="Brief bio or description"
                />
              </div>
            )} */}
            
            {/* Additional fields for Doctor role */}
            {/* {formData.role === 'Doctor' && (
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="e.g. +1234567890"
                />
                
                <label htmlFor="avatar" className="text-sm font-medium">Avatar URL</label>
                <Input 
                  id="avatar" 
                  name="avatar" 
                  value={formData.avatar} 
                  onChange={handleChange}
                  placeholder="e.g. https://example.com/avatar.jpg"
                />
                
                <label htmlFor="medicalfacilityId" className="text-sm font-medium">Medical Facility</label>
                <Select 
                  id="medicalfacilityId" 
                  name="medicalfacilityId" 
                  value={formData.medicalfacilityId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, medicalfacilityId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a medical facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalFacilities.length === 0 ? (
                      <SelectItem value="no-facilities">No facilities found</SelectItem>
                    ) : (
                      medicalFacilities.map(facility => (
                        <SelectItem key={facility._id} value={facility._id}>
                          {facility.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )} */}
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
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
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await accountAPI.getAllUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive !== false) ||
      (statusFilter === 'inactive' && user.isActive === false);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user edit
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  // Handle user save
  const handleSaveUser = async (userId, userData) => {
    try {
      // Create a copy of userData to modify if needed
      const dataToSubmit = { ...userData };
      
      // Extract role-specific data
      const { counselorData, doctorData, ...accountData } = dataToSubmit;
      
      if (userId) {
        // If updating and password field is empty, remove it from the data
        if (!accountData.password) {
          delete accountData.password;
        }
        
        // Update existing user
        await accountAPI.updateUser(userId, accountData);
        
        // Handle role-specific updates
        if (accountData.role === 'Counselor' && counselorData) {
          // Update or create counselor data
          try {
            // First check if a counselor record exists for this account
            const counselorResponse = await counselorAPI.getAll();
            const existingCounselor = counselorResponse.data.find(
              counselor => counselor.accountId && counselor.accountId._id === userId
            );
            
            if (existingCounselor) {
              // Update existing counselor using the counselorId
              await counselorAPI.update(existingCounselor._id, {
                ...counselorData,
                accountId: userId,
                name: accountData.name
              });
            } else {
              // Create new counselor
              await counselorAPI.create({
                ...counselorData,
                accountId: userId,
                name: accountData.name
              });
            }
            showNotification("Counselor information updated successfully!");
          } catch (error) {
            console.error('Error updating counselor data:', error);
            showNotification("Error updating counselor information.", "error");
          }
        }
        
        if (accountData.role === 'Doctor' && doctorData) {
          // Update or create doctor data
          try {
            // First check if a doctor record exists for this account
            const doctorResponse = await doctorAPI.getAll();
            const existingDoctor = doctorResponse.data.find(
              doctor => doctor.accountId === userId
            );
            
            if (existingDoctor) {
              // Update existing doctor using the doctorId
              await doctorAPI.update(existingDoctor._id, {
                ...doctorData,
                accountId: userId,
                name: accountData.name
              });
            } else {
              // Create new doctor
              await doctorAPI.create({
                ...doctorData,
                accountId: userId,
                name: accountData.name
              });
            }
            showNotification("Doctor information updated successfully!");
          } catch (error) {
            console.error('Error updating doctor data:', error);
            showNotification("Error updating doctor information.", "error");
          }
        }
        
        // Update the users list with the updated user
        // Remove password from the local state for security
        const { password: _pw, ...userDataForState } = accountData;
        setUsers(users.map(user => 
          user._id === userId ? { ...user, ...userDataForState } : user
        ));
        
        showNotification(`User ${accountData.name} updated successfully!`);
      } else {
        // Create new user - password is required here
        if (!accountData.password) {
          alert('Password is required for new users');
          return;
        }
        
        // Create the account first
        const response = await accountAPI.createUser(accountData);
        const newUserId = response.data._id;
        
        // If counselor role, create counselor profile
        if (accountData.role === 'Counselor' && counselorData) {
          try {
            await counselorAPI.create({
              ...counselorData,
              accountId: newUserId,
              name: accountData.name
            });
            showNotification("Counselor profile created successfully!");
          } catch (error) {
            console.error('Error creating counselor profile:', error);
            showNotification("Error creating counselor profile.", "error");
          }
        }
        
        // If doctor role, create doctor profile
        if (accountData.role === 'Doctor' && doctorData) {
          try {
            await doctorAPI.create({
              ...doctorData,
              accountId: newUserId,
              name: accountData.name
            });
            showNotification("Doctor profile created successfully!");
          } catch (error) {
            console.error('Error creating doctor profile:', error);
            showNotification("Error creating doctor profile.", "error");
          }
        }
        
        // Add the new user to the list
        setUsers([...users, response.data]);
        showNotification(`User ${accountData.name} created successfully!`);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      showNotification(`Error: ${error.message || 'Unknown error'}`, "error");
    }
  };
  
  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };
  
  // Handle delete user
  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await accountAPI.deleteUser(userToDelete._id);
      
      // Remove user from the list
      setUsers(users.filter(user => user._id !== userToDelete._id));
      
      setIsDeleteModalOpen(false);
      
      showNotification('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification toast */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 z-50 rounded-md p-4 shadow-lg max-w-xs ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
            'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : (
              <XCircle size={18} className="text-red-600" />
            )}
            <p>{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification({ show: false, message: '', type: 'success' })}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">User Management</h1>
          <p className="text-gray-500">Manage all users of your platform</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </Button> */}
          <Button className="gap-2" onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}>
            <UserPlus size={18} />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 sm:w-auto">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <span className="hidden sm:inline">Role</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {/* <SelectItem value="Customer">Customer</SelectItem> */}
                  <SelectItem value="Counselor">Counselor</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    <span className="hidden sm:inline">Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No users found matching your filters</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            user.role === 'Admin' ? 'border-red-500 text-red-500' :
                            user.role === 'Manager' ? 'border-purple-500 text-purple-500' :
                            user.role === 'Counselor' ? 'border-blue-500 text-blue-500' :
                            user.role === 'Doctor' ? 'border-green-500 text-green-500' :
                            'border-gray-500 text-gray-500'
                          }
                        >
                          {user.role || 'Customer'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isActive !== false ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                            <div className="flex items-center gap-1">
                              <CheckCircle size={12} />
                              Active
                            </div>
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
                            <div className="flex items-center gap-1">
                              <XCircle size={12} />
                              Inactive
                            </div>
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewUser(user)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user)} className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => confirmDeleteUser(user)} className="cursor-pointer text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination would go here */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div>Showing {filteredUsers.length} of {users.length} users</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {isModalOpen && (
        <UserEditModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}
      
      {/* View User Modal */}
      <Dialog.Root open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
      <Dialog.Portal>
         <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
         <Dialog.Content className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 shadow-lg max-w-[500px] w-full max-h-[85vh] overflow-y-auto focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="mb-4">
            <Dialog.Title className="text-lg font-semibold">User Details</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mt-1">
              View detailed information about this user.
            </Dialog.Description>
          </div>
          {selectedUser && (
            <div className="py-4 space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-700">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{selectedUser.name || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <Badge 
                    variant="outline" 
                    className={
                      selectedUser.role === 'Admin' ? 'border-red-500 text-red-500' :
                      selectedUser.role === 'Manager' ? 'border-purple-500 text-purple-500' :
                      selectedUser.role === 'Counselor' ? 'border-blue-500 text-blue-500' :
                      selectedUser.role === 'Doctor' ? 'border-green-500 text-green-500' :
                      'border-gray-500 text-gray-500'
                    }
                  >
                    {selectedUser.role || 'Customer'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {selectedUser.isActive !== false ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                      <div className="flex items-center gap-1">
                        <CheckCircle size={12} />
                        Active
                      </div>
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
                      <div className="flex items-center gap-1">
                        <XCircle size={12} />
                        Inactive
                      </div>
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined On</p>
                  <p className="font-medium">
                    {selectedUser.createdAt 
                      ? new Date(selectedUser.createdAt).toLocaleDateString() 
                      : 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {selectedUser.lastLogin 
                      ? new Date(selectedUser.lastLogin).toLocaleDateString() 
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewModalOpen(false);
              handleEditUser(selectedUser);
            }}>Edit User</Button>
          </div>
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
      
      {/* Delete Confirmation Modal */}
      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Portal> 
             <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed z-50 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg p-6 shadow-lg max-w-[400px] w-full focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="mb-4">
            <Dialog.Title className="text-lg font-semibold">Delete User</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mt-1">
              Are you sure you want to delete this user? This action cannot be undone.
            </Dialog.Description>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
          </div>
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

      {/* Notification Toast */}
      {/* {notification.show && (
        <div className={`fixed bottom-4 right-4 z-50 max-w-xs w-full rounded-lg p-4 shadow-lg 
          ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default UserManagement;
