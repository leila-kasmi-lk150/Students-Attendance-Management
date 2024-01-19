// checkAttendance= false
<View style={{ marginTop: 22, flex: 1 }}>
<Text style={{ fontSize: 22, fontWeight: "bold" }}> Check Attendance </Text>
<View style={{ flex: 1 }}>
  <FlatList
    data={studentList}
    renderItem={renderStudentItem}
    keyExtractor={(item) => item.student_id.toString()}
  />
  {selectedStudent && (
    <Modal
      isVisible={isModalPresenceVisible}
      onBackdropPress={() => setModalPresenceVisible(false)}
    >
      <View style={styles.modalContent}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          {selectedStudent.student_lastName}{" "}
          {selectedStudent.student_firstName}
        </Text>
        <View>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 5,
              fontWeight: "600",
            }}
          >
            State:
          </Text>
        </View>
        <RadioButton.Group
          onValueChange={(value) => setSelectedStatus(value)}
          value={selectedStatus}
        >
          <View style={{ flexDirection: "row" }}>
            <RadioButton.Item label="Present" value="present" />
            <RadioButton.Item label="Absent" value="absent" />
          </View>
        </RadioButton.Group>
        <View>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 5,
              fontWeight: "600",
            }}
          >
            Comment:
          </Text>
        </View>
        <TextInput
          style={[styles.modalInput, { width: "100%" }]}
          placeholder="Enter comment"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 100,
          }}
        >
          <TouchableOpacity
            onPress={handleSavePresence}
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
              alignItems: "center",
              margin: 3,
              left: 16,
            }}
          >
            <Text style={styles.buttonTexts}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleModalPresence}
            style={{
              backgroundColor: colors.primary,
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
              alignItems: "center",
              margin: 3,
              left: 16,
            }}
          >
            <Text style={styles.buttonTexts}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )}
</View>
</View>