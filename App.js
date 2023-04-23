import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { theme } from "./colors";
import { useState } from "react";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const addToDo = () => {
    if (text === "") return;
    // useState를 사용할 때는 직접 변형을 시키면 않되기 때문에 아래의 Object.assign으로 Object를 state 수정없이 합칠 수 있다.
    const newToDos = Object.assign({}, toDos, { [Date.now()]: { text, work: working } });
    setToDos(newToDos);
    setText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: working ? theme.grey : "white" }}>
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={working ? "할 일을 추가하세요." : "어디에 가고 싶습니까?"}
        textAlign="center"
        onChangeText={onChangeText}
        value={text}
        onSubmitEditing={addToDo}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    color: "white",
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    fontSize: 18,
  },
});
