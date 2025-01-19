import struct
import threading
import serial
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from queue import Queue

x_data, y_data = [], []
fig, ax = plt.subplots()
line, = ax.plot([], [], 'r-', label="Shake")  # Rdeča črta
data_queue = Queue()

ax.set_xlim(0, 50)
ax.set_ylim(0, 1)  # X-os za med 0 in 1
ax.legend(loc="upper left")

def init():
    line.set_data([], [])
    return line,

def update(frame):
    global x_data, y_data
    while not data_queue.empty():
        paket, shake = data_queue.get()
        x_data.append(paket)
        y_data.append(shake)

        # Shrani podatke
        if len(x_data) > 1000:
            x_data.pop(0)
            y_data.pop(0)

    # Dinamično prilagajanje x osi
    if x_data:
        ax.set_xlim(min(x_data), max(x_data))

    # Posodobitev podatkov na črti
    line.set_data(x_data, y_data)
    return line,

ani = FuncAnimation(fig, update, init_func=init, interval=100, blit=False)

def serial_reader(port, baudrate):
    try:
        ser = serial.Serial(port, baudrate, timeout=2)
        print(f"Serijski port {port} odprt.")

        paket = -1
        while True:
            paket += 1
            data = ser.read_until(b'\n\r').decode('ascii', errors='ignore').strip()
            if data.startswith("0xAAAB"):
                try:
                    _, shake_value = data.split(",")
                    shake = float(shake_value)
                    #print(f"Prejeto: Paket #{paket}, Shake: {shake:.3f}")
                    data_queue.put((paket, shake))
                except ValueError:
                    print(f"Napaka pri obdelavi podatkov: {data}")
    except serial.SerialException as e:
        print(f"Napaka pri serijski komunikaciji: {e}")
    except KeyboardInterrupt:
        print("Program prekinjen.")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()
            print("Serijski port zaprt.")

if __name__ == "__main__":
    port = "COM5"
    baudrate = 9600
    threading.Thread(target=serial_reader, args=(port, baudrate), daemon=True).start()
    plt.show()
