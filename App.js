import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "./colors";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";
const STARTSCREEN = "@startScreen";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [loading, setLoading] = useState(true);
  const [toDoId, setToDoId] = useState("");
  const [editShow, setEditShow] = useState(false);
  const [editText, setEditText] = useState("");
  useEffect(() => {
    loadToDos();
  }, []);
  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem(STARTSCREEN, JSON.stringify(false));
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem(STARTSCREEN, JSON.stringify(true));
  };
  const onChangeText = (payload) => setText(payload);
  const onChageEditText = (payloed) => setEditText(payloed);

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.log(error);
    }
  };

  const loadToDos = async () => {
    try {
      const startScreen = await AsyncStorage.getItem(STARTSCREEN);
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setWorking(JSON.parse(startScreen));
      setToDos(JSON.parse(s));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addToDo = async () => {
    if (text === "") return;
    // useState를 사용할 때는 직접 변형을 시키면 않되기 때문에 아래의 Object.assign으로 Object를 state 수정없이 합칠 수 있다.
    const newToDos = { [Date.now()]: { text, working, complete: false }, ...toDos }; // es6를 이용한 방법
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const deleteToDo = (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("삭제하시겠습니까?");
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert("삭제하시겠습니까?", "확실합니까?", [
        { text: "취소" },
        {
          text: "확인",
          style: "destructive",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]);
    }
  };

  const updateToDo = (key) => {
    if (editText === "") return;
    const newToDos = { ...toDos };
    newToDos[key].text = editText;
    setToDos(newToDos);
    saveToDos(newToDos);
    setEditShow(false);
  };

  const toDoComplete = (key) => {
    if (!toDos[key].complete) {
      const newToDos = { ...toDos };
      newToDos[key].complete = true;
      setToDos(newToDos);
      saveToDos(newToDos);
    } else {
      const newToDos = { ...toDos };
      newToDos[key].complete = false;
      setToDos(newToDos);
      saveToDos(newToDos);
    }
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

      {loading ? (
        <ActivityIndicator size={"large"} style={{ marginTop: 20 }} color={"white"} />
      ) : (
        <ScrollView>
          {/* Object.keys 함수를 이용하면 Object들의 키를 배열로 반환해준다. */}
          {toDos &&
            Object.keys(toDos).map((key) => {
              return (
                toDos[key].working === working && (
                  <View key={key} style={styles.toDo}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      {toDoId === key && editShow ? (
                        <TextInput
                          style={styles.input}
                          placeholder={
                            working ? "할 일을 추가하세요." : "어디에 가고 싶습니까?"
                          }
                          textAlign="center"
                          onChangeText={onChageEditText}
                          value={editText}
                          onSubmitEditing={() => updateToDo(key)}
                          returnKeyType="done"
                        />
                      ) : (
                        <Text
                          style={{
                            ...styles.toDoText,
                            textDecorationLine: toDos[key].complete
                              ? "line-through"
                              : "none",
                            color: toDos[key].complete ? theme.grey : "white",
                          }}
                        >
                          {toDos[key].text}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {editShow && toDoId === key ? (
                        <TouchableOpacity onPress={() => setEditShow(!editShow)}>
                          <MaterialIcons
                            name="cancel"
                            size={25}
                            color="white"
                            style={{ marginLeft: 10 }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setToDoId(key);
                            setEditShow(!editShow);
                            setEditText(toDos[key].text);
                          }}
                          style={{ marginLeft: 10 }}
                        >
                          <Feather name="edit" size={25} color="white" />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={{ marginHorizontal: 10 }}
                        onPress={() => toDoComplete(key)}
                      >
                        {toDos[key].complete === false ? (
                          <Fontisto name="checkbox-passive" size={20} color="white" />
                        ) : (
                          <Fontisto name="checkbox-active" size={20} color="white" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteToDo(key)}>
                        <Fontisto name="trash" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              );
            })}
        </ScrollView>
      )}
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
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
