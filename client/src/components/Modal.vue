<template>
  <div class="modal-overlay">
    <!-- div for modal header for the title -->
    <div class="modal-header">
      <table class="header-table">
        <tr>
          <td class="header-title">
            <h3>Chatbot</h3>
          </td>
          <td class="header-close">
            <a @click="$emit('close')" class="close-btn">X</a>
          </td>
        </tr>
      </table>
    </div>
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>

<style>
.modal-overlay {
  position: fixed;
  bottom: 9%;
  right: 3%;
  width: 500px;
  height: 600px;
  background-color: rgba(255, 255, 255);
  z-index: 999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.342);
}

.modal-header {
  width: 100%;
  height: 7%;
  background-color: #000;
  color: #fff;
}

.header-table {
  width: 100%;
  vertical-align: middle;
}

.header-title {
  width: 90%;
  padding-left: 25px;
  padding-top: 5px;
}

.header-close {
  width: 10%;
  text-align: right;
  padding-bottom: 5px;
}

.close-btn {
  margin: 0 15px 5px 0;
  font-size: 24px;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
}

.close-btn:hover {
  color: #BBB;
}

.modal-content {
  width: 100%;
  height: 93%;
  background-color: #fff;
}
</style>
