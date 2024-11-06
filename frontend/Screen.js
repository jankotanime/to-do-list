const screen = () => {
    return (
        <View style={styles.screen}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}
      style={styles.scrollView}>
          <View style={styles.mask}>
            <View style={styles.main_container}>
              {tasks.map((task) => (
                addTask(task.id, "false", "20:00", task.plot)
              ))}
              <View style={styles.title}>
                <Text style={styles.text_main}>AAAAA</Text>
              </View>
              <View style={styles.title}>
                <Text style={styles.text_main}>AAAAA</Text>
              </View>
              <View style={styles.title}>
                <Text style={styles.text_main}>AAAAA</Text>
              </View>
              <Button title="button" onPress={() => {setX(x + 1);}} />
            </View>
          </View> 
          </ScrollView>
          <SideDrawer />
        </View>
      );
}