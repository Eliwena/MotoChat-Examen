<template>
    <div class="messages-container">
        <div v-for="message in messages" :key="message">
            <div class="message-bubble">
                {{ message }}
            </div>
        </div>

        <div v-if="help_type">
            <div class="btn-containers">
                <button
                    v-for="button in buttons"
                    :key="button.value"
                    class="group-btn"
                    @click="handleClick(button.value, toEmit.value)"
                    >
                    {{ button.title }}
                </button>
            </div>
        </div>

        <div v-else-if="buttons.length != 0">

            <button
                v-for="button in buttons"
                :key="button.value"
                class="group-btn"
                @click="handleClick(toEmit, button.value)"
            >
                {{ button.title }}
            </button>

        </div>

        <div v-else>
            <input type="text" v-model="message">
            <button class="input-btn" @click="handleSubmit(toEmit, message)">Submit</button>
        </div>
    </div>
</template>

<style>
.messages-container {
    height: 100%;
    overflow-y: scroll;
    border-bottom: 1px solid #000;
}

.input-container {
    height: 10%;
}

.message-bubble {
    padding: 10px 15px;
    border-radius: 20px;
    background-color: #e5e5e5;
    margin-bottom: 10px;
    max-width: 60%;
    margin-top: 10px;
    margin-right: 10px;
    float: right;
}

.btn-containers {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.group-btn {
    width: 175px;
    height: 50px;
    border-radius: 5px;
    text-align: center;
    margin-top: 10px;
}

.input-btn {
    width: 100px;
    height: 40px;
    border-radius: 5px;
    text-align: center;
    margin-left: 10px;
}
</style>

<script>
import { ref } from 'vue'
import { io } from 'socket.io-client'

export default {
    setup() {
        const socket = io('http://localhost:8000')

        const message = ref('')

        const help_type = ref(false)
        const messages = ref([])
        const buttons = ref([])
        const toEmit = ref('')
        
        socket.emit('help_request', 'Hello')

        socket.on('help_type', (data) => {
            messages.value.push(data.message)
            buttons.value = data.buttons
            toEmit.value = ''
            help_type.value = true
        })

        socket.on('help_request_restart', (data) => {
            messages.value.push(data.message)
            buttons.value = data.buttons
            toEmit.value = ''
            help_type.value = true
        })

        socket.on('vehicle_year_question', (data) => {
            messages.value.push(data.message)
            buttons.value = []
            toEmit.value = data.toEmit
            help_type.value = false
            message.value = ''
        })

        socket.on('last_maintenance_question', (data) => {
            messages.value.push(data.message)
            buttons.value = []
            toEmit.value = data.toEmit
            help_type.value = false
            message.value = ''
        })

        socket.on('current_week_availability', (data) => {
            messages.value.push(data.message)
            buttons.value = data.availability
            toEmit.value = data.toEmit
            help_type.value = false
        })

        socket.on('next_week_availability', (data) => {
            messages.value.push(data.message)
            buttons.value = data.availability
            toEmit.value = data.toEmit
            help_type.value = false
        })

        socket.on('appointment_confirmed', (data) => {
            messages.value.push(data.message)
            buttons.value = []
            toEmit.value = []
            help_type.value = false
        })

        socket.on('no_availability', (data) => {
            messages.value.push(data.message)
            buttons.value = []
            toEmit.value = []
            help_type.value = false
        })

        socket.on('km_driven_question', (data) => {
            messages.value.push(data.message)
            buttons.value = []
            toEmit.value = data.toEmit
            help_type.value = false
            message.value = ''
        })

        socket.on('schedule_maintenance_question', (data) => {
            messages.value.push(data.message)
            buttons.value = data.buttons
            toEmit.value = data.toEmit
            help_type.value = false
        })

        socket.on('usage_type_question', (data) => {
            messages.value.push(data.message)
            buttons.value = data.buttons
            toEmit.value = data.toEmit
            help_type.value = false
        })

        socket.on('contact_info_type_question', (data) => {
            messages.value.push(data.message)
            buttons.value = data.buttons
            toEmit.value = data.toEmit
            help_type.value = false
        })

        socket.on('contact_email', (data) => {
            messages.value.push(data.message)
            buttons.value = []
            toEmit.value = ''
            help_type.value = false
        })

        socket.on('contact_phone', (data) => {
            messages.value.push(data.message)
            buttons.value = []
            toEmit.value = ''
            help_type.value = false
        })

        socket.on('disconnected_chatbot', () => {
            messages.value = []
            buttons.value = []
            toEmit.value = []
            help_type.value = true
        })

        const handleClick = (toEmit, value) => {
            socket.emit(toEmit, value)
        }

        const handleSubmit = (toEmit, value) => {
            socket.emit(toEmit, value)
        }

        return {
            message,
            help_type,
            messages,
            buttons,
            toEmit,
            handleClick,
            handleSubmit
        }
    }
}
</script>
