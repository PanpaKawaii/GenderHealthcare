export default function CustomerDetail({ customer }) {
  if (!customer || !customer.accountId) return <p>Không có thông tin khách hàng.</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Thông tin khách hàng</h3>
      <p><strong>Họ tên:</strong> {customer.accountId.name}</p>
      <p><strong>Email:</strong> {customer.accountId.email}</p>
      <p><strong>Giới tính:</strong> {customer.accountId.gender}</p>
      <p><strong>Ngày sinh:</strong> {customer.dateOfBirth ? new Date(customer.dateOfBirth).toLocaleDateString() : '---'}</p>
      <p><strong>Số điện thoại:</strong> {customer.accountId.phone}</p>
      <p><strong>Địa chỉ:</strong> {customer.address}</p>
    </div>
  );
}
