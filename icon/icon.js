

const example = {
  text: "hello world",
  sayHello() {
    if (true)
      console.log(this.text);
    // else
  }
};