const handleImportData = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv',
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri; // Access uri from assets array
      const fileType = fileUri.endsWith('.csv') ? 'csv' : 'xlsx'; // Use fileUri to determine file type

      let firstNameIndex = -1;
      let lastNameIndex = -1;

      if (fileType === 'csv') {
        // Parse CSV
        const response = await fetch(fileUri);
        const csvString = await response.text();
        const csvData = Papa.parse(csvString);

        // Find the column indices for first and last names
        if (csvData.data.length > 0) {
          // Assuming the type of csvData.data is string[][]
          const headerRow: string[] = (csvData.data[0] as string[]) || [];
          firstNameIndex = headerRow.findIndex((col) => col.toLowerCase().includes('first'));
          lastNameIndex = headerRow.findIndex((col) => col.toLowerCase().includes('last'));
        }

        // Insert data into the database
        db.transaction((txn) => {
          for (let i = csvData.data.length - 1; i >= 0; i--) {
            // const row = csvData.data[i];
            const row: string[] = (csvData.data[i] as string[]) || [];

            // Additional check for non-empty, non-undefined values
            if (row[firstNameIndex] !== undefined && row[lastNameIndex] !== undefined && row[firstNameIndex] !== '' && row[lastNameIndex] !== '') {
              txn.executeSql(
                'INSERT INTO table_students (student_firstName, student_lastName, class_id, group_id) VALUES (?, ?, ?, ?)',
                [row[firstNameIndex], row[lastNameIndex], class_id, group_id],
                (_, res) => {
                  console.log('Insertion successful:', res);
                },
              );
            }
          }
        });
      } else if (fileType === 'xlsx') {
        // ... (similar logic for XLSX)
      }
    } else {
      console.log('Document picking canceled');
    }
  } catch (error) {
    console.error('File selection error:', error);
  }
};