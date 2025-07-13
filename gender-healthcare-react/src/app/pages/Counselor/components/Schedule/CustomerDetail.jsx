export default function CustomerDetail({ customer }) {
  if (!customer || !customer.accountId) {
    return (
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm text-sm text-gray-500">
        No customer information available.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-md space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Info</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li><strong>Name:</strong> {customer.accountId.name}</li>
        <li><strong>Email:</strong> {customer.accountId.email}</li>
        <li><strong>Gender:</strong> {customer.accountId.gender}</li>
        <li><strong>Date of Birth:</strong> {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : '---'}</li>
        <li><strong>Phone:</strong> {customer.accountId.phone || '---'}</li>
        <li><strong>Address:</strong> {customer.address || '---'}</li>
      </ul>
    </div>
  );
}
