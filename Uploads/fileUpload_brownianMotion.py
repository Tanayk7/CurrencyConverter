
# import libraries
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# set a random seed
np.random.seed(1234)


def brownian_motion(N, T, h):
    """
    Simulates a Brownian motion
    :param int N : the number of discrete steps
    :param int T: the number of continuous time steps
    :param float h: the variance of the increments
    """   
    # the normalizing constant
    dt = 1 * T/N
    # the epsilon values
    random_increments = np.random.normal(0.0, 1.0 * h, N)*np.sqrt(dt)
    # calculate the brownian motion
    brownian_motion = np.cumsum(random_increments)
    # insert the initial condition
    brownian_motion = np.insert(brownian_motion, 0, 0.0)
    
    return brownian_motion, random_increments


N = 50 # the number of discrete steps
T = 1 # the number of continuous time steps
h = 1 # the variance of the increments
dt = 1.0 * T/N  # total number of time steps

# generate a brownian motion
X, epsilon = brownian_motion(N, T ,h)
t = np.linspace(0.0, N*dt, N+1)

# plot the brownian motion
plt.figure(figsize=(15, 7))
plt.title('Brownian Motion', fontsize=24)
plt.xlabel('Time', fontsize=22)
plt.ylabel('Value', fontsize=22)
plt.xticks(fontsize=18)
plt.yticks(fontsize=18)

plt.grid(True, which='major', linestyle='--', color='black', alpha=0.8)
plt.step(t, X, where='mid')
plt.plot(t, X, 'C0o', alpha=0.5)
plt.show()

 
fig = plt.figure(figsize=(21, 10))
ax = plt.axes(xlim=(0, 1)) 
line, = ax.step([], [], where='mid', color='#0492C2')
    
# formatting options
ax.set_xticks(np.linspace(0,1,11))
ax.set_xlabel('Time', fontsize=30)
ax.set_ylabel('Value', fontsize=30)
ax.tick_params(labelsize=22)
ax.grid(True, which='major', linestyle='--', color='black', alpha=0.6)

# initialization function 
def init():
    line.set_data([], [])
    return line,

# animation function 
def animate(i):
    np.random.seed(42)
    y, epsilon = brownian_motion((i + 1) * 10, 1 ,1)
    tr = np.linspace(0.0, 1, (i + 1) * 10 + 1)
    ax.set_title('Brownian Motion for {} steps'.format((i + 1) * 10), fontsize=40)
    ax.set_ylim((np.min(y) - 0.1, np.max(y) + 0.1))
    
    line.set_data(list(tr), list(y)) 
    return line,

# call the animator	 
anim = animation.FuncAnimation(fig, animate, init_func=init, frames=200, interval=150, blit=True)
anim.save('brownian_motion.gif',writer="imagemagick")
