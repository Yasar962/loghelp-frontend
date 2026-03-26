export default function SearchBar() {
  return (
    <div style={styles.container}>
      <div style={styles.filterBtn}>2 Active Filters</div>
      <input 
        type="text" 
        placeholder="Search by name..." 
        style={styles.input} 
      />
    </div>
  );
}

const styles = {
  container: { display: 'flex', gap: '15px', padding: '20px', borderBottom: '1px solid #eee' },
  filterBtn: { border: '1px solid #ddd', padding: '8px 15px', borderRadius: '4px', fontSize: '14px' },
  input: { flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }
};