-- Native Rive gameplay. Data binding drives editable RML objects and the state machine.
type Terminal = {vm: ViewModel?, time: number, typed: string, history: {string},
    door: boolean, dark: boolean, entity: boolean, ended: boolean,
    camera: number, power: number, targetX: number, targetY: number,
    mouseX: number, mouseY: number, doorScale: number, glitch: number}
local function number(self: Terminal, name: string, value: number)
    if self.vm == nil then return end
    local prop = self.vm:getNumber(name)
    if prop ~= nil then prop.value = value end
end
local function text(self: Terminal, name: string, value: string)
    if self.vm == nil then return end
    local prop = self.vm:getString(name)
    if prop ~= nil then prop.value = value end
end
local function say(self: Terminal, line: string)
    table.insert(self.history, line)
    while #self.history > 6 do table.remove(self.history, 1) end
    text(self, 'terminalText', table.concat(self.history, '\n'))
end
local function reset(self: Terminal)
    self.door = false; self.dark = false; self.entity = false; self.ended = false
    self.camera = 1; self.power = 43; self.glitch = 0; self.typed = ''; self.doorScale = 1
    self.history = {'HAUNTED SYSTEM OS v6.66 / ACHERON RESEARCH', 'Connection established. You are not alone.', 'Type HELP, or click a control. Enter executes.'}
    text(self, 'terminalText', table.concat(self.history, '\n'))
    number(self, 'state', 0)
    text(self, 'endingText', '')
end
local function execute(self: Terminal, raw: string)
    local command = string.upper(raw):gsub('^%s+', ''):gsub('%s+$', ''):gsub('%s+', '_')
    if command == '' then return end
    if command == 'RESET' then reset(self); return end
    if command == 'CLEAR' then self.history = {}; text(self, 'terminalText', ''); return end
    say(self, '> ' .. command)
    if self.ended then say(self, 'Session ended. Type RESET to begin again.'); return end
    if command == 'HELP' then
        say(self, 'STATUS / CAMERA / OPEN_DOOR / LIGHTS_OFF / LIGHTS_ON')
        say(self, 'ESCAPE / CLEAR / RESET / WHO_ARE_YOU')
        say(self, 'Hint: it can only follow what the light reveals.')
    elseif command == 'STATUS' then
        say(self, `POWER: {self.power}% / SECURITY: OFFLINE / ENTITY: DETECTED`)
        say(self, 'Camera 03 recorded movement in an empty room.')
        if not self.door then number(self, 'state', 1) end
    elseif command == 'CAMERA' then
        self.camera = self.camera % 4 + 1
        if self.camera == 3 then self.entity = true end
        say(self, `CAMERA 0{self.camera}: anomalous signal detected.`)
    elseif command == 'OPEN_DOOR' then
        if self.door then say(self, 'Containment is already open.'); return end
        self.door = true; self.power -= 9; number(self, 'state', 3)
        say(self, 'Containment released. Something stopped breathing.')
    elseif command == 'LIGHTS_OFF' then
        self.dark = true; self.entity = true
        if not self.door then number(self, 'state', 2) end
        say(self, 'Lighting disconnected. Two eyes. Neither yours.')
    elseif command == 'LIGHTS_ON' then
        self.dark = false; say(self, 'Emergency lights restored.')
    elseif command == 'WHO_ARE_YOU' then
        self.entity = true; self.glitch = 1; number(self, 'state', 4)
        say(self, 'YOU SHOULD NOT HAVE ASKED. I was here before you.')
    elseif command == 'ESCAPE' then
        if not self.door then say(self, 'Exit sealed. Use OPEN_DOOR.'); self.glitch = 0.6; return end
        self.ended = true; self.entity = true; self.glitch = 1
        if self.dark then
            number(self, 'state', 6)
            text(self, 'endingText', 'YOU ESCAPED. / No light. No shadow. Nothing to follow.')
            say(self, 'ENDING 01: THE SILENT EXIT. Type RESET to return.')
        else
            number(self, 'state', 5)
            text(self, 'endingText', 'IT FOLLOWED YOU. / Your room is not empty anymore.')
            say(self, 'ENDING 02: THE NEW OPERATOR. Type RESET to return.')
        end
    else
        self.glitch = 1; say(self, 'Unknown command. Stop making noise. Type HELP.')
    end
end
local function init(self: Terminal, context: Context): boolean
    self.vm = context:viewModel()
    return true
end
local function advance(self: Terminal, seconds: number): boolean
    self.time += seconds
    local k = 1 - math.exp(-2.5 * seconds)
    self.mouseX += (self.targetX - self.mouseX) * k
    self.mouseY += (self.targetY - self.mouseY) * k
    self.doorScale += ((if self.door then 0.12 else 1) - self.doorScale) * k
    self.glitch = math.max(0, self.glitch - seconds * 1.4)
    number(self, 'mouseX', self.mouseX); number(self, 'mouseY', self.mouseY)
    number(self, 'ghostX', 550 + (self.mouseX - 0.5) * 35)
    number(self, 'ghostY', 215 + math.sin(self.time * 1.3) * 9 + (self.mouseY - 0.5) * 14)
    number(self, 'entityOpacity', if self.entity then 0.8 else 0.09)
    number(self, 'doorScale', self.doorScale)
    number(self, 'darkOpacity', if self.dark then 0.87 else 0)
    number(self, 'glitch', self.glitch)
    number(self, 'scareOpacity', if self.ended and not self.dark then 1 else 0)
    text(self, 'currentInput', '> ' .. self.typed .. (if math.floor(self.time * 2) % 2 == 0 then '_' else ' '))
    text(self, 'statusText', `POWER                  {self.power}%\nSECURITY               OFFLINE\nCONTAINMENT            {if self.door then 'OPEN' else 'LOCKED'}\nENTITY                 {if self.entity then 'CONFIRMED' else 'DETECTED'}`)
    local cameras = {'CONTROL ROOM', 'EAST CORRIDOR', 'CONTAINMENT', 'EMERGENCY EXIT'}
    text(self, 'cameraText', `REC   CAM_0{self.camera} / {cameras[self.camera]}`)
    number(self, 'cameraShift', -(self.camera - 1) * 16)
    if self.vm ~= nil then
        local command = self.vm:getString('currentCommand')
        if command ~= nil and command.value ~= '' then
            execute(self, command.value); command.value = ''
        end
    end
    return true
end
local function pointerMove(self: Terminal, event: PointerEvent)
    self.targetX = math.clamp(event.position.x / 1280, 0, 1)
    self.targetY = math.clamp(event.position.y / 900, 0, 1)
end
local function pointerDown(self: Terminal, event: PointerEvent)
    local x, y = event.position.x, event.position.y
    if y >= 650 and y <= 702 and x >= 40 and x <= 880 then
        if x < 320 then execute(self, 'OPEN_DOOR')
        elseif x < 600 then execute(self, if self.dark then 'LIGHTS_ON' else 'LIGHTS_OFF')
        else execute(self, 'CAMERA') end
        event:hit()
    elseif x >= 920 and y >= 740 and y <= 795 then
        execute(self, 'ESCAPE'); event:hit()
    elseif x >= 920 and y >= 810 and y <= 860 then
        execute(self, 'RESET'); event:hit()
    end
end
local function keyboardEvent(self: Terminal, event: KeyboardEvent): boolean
    if event.phase == 'up' then return false end
    if event.key == 257 then execute(self, self.typed); self.typed = ''
    elseif event.key == 259 then self.typed = string.sub(self.typed, 1, -2)
    else return false end
    return true
end
local function textEvent(self: Terminal, event: TextInput): boolean
    if #self.typed < 72 then self.typed ..= event.text end
    return true
end
return function(context: Context): Layout<Terminal>
    return {vm = nil, time = 0, typed = '', history = {'HAUNTED SYSTEM OS v6.66 / ACHERON RESEARCH', 'Connection established. You are not alone.', 'Type HELP, or click a control. Enter executes.'},
        door = false, dark = false, entity = false, ended = false, camera = 1, power = 43,
        targetX = 0.5, targetY = 0.5, mouseX = 0.5, mouseY = 0.5, doorScale = 1, glitch = 0,
        init = init, advance = advance, pointerMove = pointerMove, pointerDown = pointerDown,
        keyboardEvent = keyboardEvent, textEvent = textEvent}
end
