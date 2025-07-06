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
import accountAPI from '../../services/accountAPI';

// User Edit Modal Component
const UserEditModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    isActive: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        isActive: user.isActive !== false // default to true if not specified
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user._id, formData);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
<Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
  <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title>{user ? 'Edit User' : 'Create New User'}</Dialog.Title>
          <Dialog.Description>
            {user ? 'Update user details' : 'Enter information for the new user'}
          </Dialog.Description>
        </Dialog.Header>
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
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="counselor">Counselor</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="isActive" className="text-sm font-medium">Active Status</label>
            <Switch 
              id="isActive" 
              checked={formData.isActive} 
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))
              }
            />
          </div>
        
          <Dialog.Footer>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </Dialog.Footer>
        </form>
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
      await accountAPI.updateUser(userId, userData);
      
      // Update the users list with the updated user
      setUsers(users.map(user => 
        user._id === userId ? { ...user, ...userData } : user
      ));
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
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
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">User Management</h1>
          <p className="text-gray-500">Manage all users of your platform</p>
        </div>
        <Button className="gap-2">
          <UserPlus size={18} />
          Add User
        </Button>
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
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="counselor">Counselors</SelectItem>
                  <SelectItem value="doctor">Doctors</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
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
                            user.role === 'admin' ? 'border-red-500 text-red-500' :
                            user.role === 'counselor' ? 'border-blue-500 text-blue-500' :
                            user.role === 'doctor' ? 'border-green-500 text-green-500' :
                            'border-gray-500 text-gray-500'
                          }
                        >
                          {user.role || 'User'}
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
          onClose={() => setIsModalOpen(false)}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}
      
      {/* View User Modal */}
      <Dialog.Root open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
      <Dialog.Portal>
         <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="sm:max-w-[500px]">
          <Dialog.Header>
            <Dialog.Title>User Details</Dialog.Title>
          </Dialog.Header>
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
                      selectedUser.role === 'admin' ? 'border-red-500 text-red-500' :
                      selectedUser.role === 'counselor' ? 'border-blue-500 text-blue-500' :
                      selectedUser.role === 'doctor' ? 'border-green-500 text-green-500' :
                      'border-gray-500 text-gray-500'
                    }
                  >
                    {selectedUser.role || 'User'}
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
          <Dialog.Footer>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsViewModalOpen(false);
              handleEditUser(selectedUser);
            }}>Edit User</Button>
          </Dialog.Footer>
        </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      
      {/* Delete Confirmation Modal */}
      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Portal> 
             <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="sm:max-w-[400px]">
          <Dialog.Header>
            <Dialog.Title>Delete User</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this user? This action cannot be undone.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
          </Dialog.Footer>
        </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default UserManagement;
