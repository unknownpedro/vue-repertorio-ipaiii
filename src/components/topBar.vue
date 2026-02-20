<template>
    <div class="top-bar">
        <div class="top-bar-left">
            <a href="#" class="logo">MyApp</a>
        </div>
        <div class="top-bar-right">
            <nav>
                <ul>
                    <button class="menu-dropdown">
                        
                    </button>
                </ul>
            </nav>
        </div>
    </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgb(134, 224, 172);
  color: rgb(0, 0, 0);
}

.top-bar-left .logo {
  color: rgb(0, 0, 0);
  text-decoration: none;
}

.top-bar-right nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.top-bar-right nav ul li {
  margin-left: 1rem;
}

.top-bar-right nav ul li a {
  color: rgb(0, 0, 0);
  text-decoration: none;
}
</style>