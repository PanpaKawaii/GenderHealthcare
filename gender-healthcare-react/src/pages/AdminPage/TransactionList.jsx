import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TRANSACTION_TYPE_LABELS = {
  deposit: 'Nạp tiền',
  withdraw: 'Rút tiền',
  payment: 'Thanh toán',
  refund: 'Hoàn tiền',
};

const STATUS_LABELS = {
  success: 'Thành công',
  pending: 'Đang xử lý',
  failed: 'Thất bại',
};

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Thay URL bằng endpoint thực tế của bạn
      const res = await axios.get('/api/admin/transactions', {
        params: {
          type: typeFilter,
          status: statusFilter,
        },
      });
      setTransactions(res.data || []);
    } catch (err) {
      setTransactions([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Quản lý giao dịch</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Loại giao dịch: </label>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value=''>Tất cả</option>
          <option value='deposit'>Nạp tiền</option>
          <option value='withdraw'>Rút tiền</option>
          <option value='payment'>Thanh toán</option>
          <option value='refund'>Hoàn tiền</option>
        </select>
        <label style={{ marginLeft: 16 }}>Trạng thái: </label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value=''>Tất cả</option>
          <option value='success'>Thành công</option>
          <option value='pending'>Đang xử lý</option>
          <option value='failed'>Thất bại</option>
        </select>
      </div>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Loại giao dịch</th>
              <th>Số tiền</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={6}>Không có giao dịch</td></tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx._id}>
                  <td>{tx.accountId?.username || tx.accountId?.email || tx.accountId}</td>
                  <td>{TRANSACTION_TYPE_LABELS[tx.type] || tx.type}</td>
                  <td>{tx.amount.toLocaleString('vi-VN')}₫</td>
                  <td>{tx.description}</td>
                  <td>{STATUS_LABELS[tx.status] || tx.status}</td>
                  <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionList;
