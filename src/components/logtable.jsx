export default function LogTable({ logs }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr style={styles.headerRow}>
          <th style={styles.th}>ALERT RULE</th>
          <th style={styles.th}>CREATED AT</th>
          <th style={styles.th}>COUNT</th>
          <th style={styles.th}>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index} style={styles.row}>
            <td style={styles.td}>
               <div style={{color: '#6b46c1', fontWeight: 'bold'}}>{log.title || "Unknown Error"}</div>
               <div style={{fontSize: '12px', color: '#666'}}>{log.id}</div>
            </td>
            <td style={styles.td}>{log.createdAt || "Mar 06, 2026"}</td>
            <td style={styles.td}>{log.count || 1}</td>
            <td style={styles.td}><button>...</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  headerRow: { textAlign: 'left', borderBottom: '2px solid #eee', fontSize: '12px', color: '#888' },
  th: { padding: '12px' },
  row: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' }
};