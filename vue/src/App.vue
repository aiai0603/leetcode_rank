<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: "App",
};
</script>

<style>
#app {
  background-color: rgba(0, 0, 0, 0.87);
  color: white;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height:100%;
  
}

body{
  margin:0;
  padding:0;
  height:100%;
}

html{
  height: 100%;
}
</style>
