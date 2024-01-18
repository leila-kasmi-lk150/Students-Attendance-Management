import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import RadioGroup, { RadioButton } from 'react-native-radio-buttons-group';

const AttendanceComponent = () => {
  const [studentList, setStudentList] = useState<StudentItem[]>([]);
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Option 1',
        value: 'option1',
      },
      {
        id: '2',
        label: 'Option 2',
        value: 'option2',
      },
    ],
    []
  );

  const [selectedIds, setSelectedIds] = useState<{ [key: string]: string | undefined }>({});

  return (
    <View style={{ marginTop: 22, flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Check Attendance</Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={studentList}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: 'lightgray',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 7,
                borderRadius: 16,
                marginVertical: 16,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 30,
                  paddingBottom: 30,
                }}
              >
                <Text style={{ flex: 1 }}>{item.student_lastName} {item.student_firstName}</Text>

                <RadioGroup
                  radioButtons={radioButtons}
                  onPress={(data) => {
    console.log('Data:', data);

    if (Array.isArray(data)) {
      const selectedRadioButton = data.find((button) => button.selected);
      console.log('Selected RadioButton:', selectedRadioButton);

      setSelectedIds((prevIds) => ({
        ...prevIds,
        [item.student_id]: selectedRadioButton ? selectedRadioButton.value : undefined,
      }));
    } else {
      console.error('Invalid data format:', data);
    }
  }}
                  selectedId={selectedIds[item.student_id]}
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.student_id.toString()}
        />
      </View>
    </View>
  );
};

export default AttendanceComponent;
