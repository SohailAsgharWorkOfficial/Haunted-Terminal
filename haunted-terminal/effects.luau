-- Four independent GPU Canvas passes. All resources are allocated once in init.
type Effect = {
    effectName: Input<string>, width: Input<number>, height: Input<number>,
    canvas: GPUCanvas?, pipeline: GPUPipeline?, group: GPUBindGroup?,
    uniform: GPUBuffer?, bytes: buffer, sampler: ImageSampler,
    time: number, vm: ViewModel?,
}
local function init(self: Effect, context: Context): boolean
    self.vm = context:viewModel()
    if self.canvas ~= nil then return true end
    local shader = context:shader(self.effectName)
    if shader == nil then return false end
    local canvas = context:gpuCanvas({width = self.width, height = self.height})
    local pipeline = GPUPipeline.new({vertex = shader, fragment = shader,
        vertexLayout = {}, colorTargets = {{format = canvas.format}}})
    local uniform = GPUBuffer.new({size = 32, usage = 'uniform'})
    self.canvas = canvas
    self.pipeline = pipeline
    self.uniform = uniform
    self.group = GPUBindGroup.new({layout = pipeline:getBindGroupLayout(0), ubos = {{slot = 0, buffer = uniform}}})
    return true
end
local function value(self: Effect, name: string, fallback: number): number
    if self.vm ~= nil then
        local prop = self.vm:getNumber(name)
        if prop ~= nil then return prop.value end
    end
    return fallback
end
local function advance(self: Effect, seconds: number): boolean
    self.time += seconds
    return true
end
local function draw(self: Effect, renderer: Renderer)
    local canvas, pipeline, group, uniform = self.canvas, self.pipeline, self.group, self.uniform
    if canvas == nil or pipeline == nil or group == nil or uniform == nil then return end
    buffer.writef32(self.bytes, 0, self.time)
    buffer.writef32(self.bytes, 4, self.width)
    buffer.writef32(self.bytes, 8, self.height)
    buffer.writef32(self.bytes, 12, value(self, 'glitch', 0))
    buffer.writef32(self.bytes, 16, value(self, 'mouseX', 0.5))
    buffer.writef32(self.bytes, 20, value(self, 'mouseY', 0.5))
    buffer.writef32(self.bytes, 24, value(self, 'darkOpacity', 0))
    buffer.writef32(self.bytes, 28, value(self, 'entityOpacity', 0))
    uniform:write(self.bytes)
    local pass = canvas:beginRenderPass({color = {{loadOp = 'clear', storeOp = 'store', clearColor = {0, 0, 0, 0}}}})
    pass:setPipeline(pipeline)
    pass:setBindGroup(0, group)
    pass:draw(3)
    pass:finish()
    renderer:drawImage(canvas.image, self.sampler, 'srcOver', 1)
end
return function(): Node<Effect>
    return {effectName = 'fog', width = 840, height = 470,
        canvas = nil, pipeline = nil, group = nil, uniform = nil,
        bytes = buffer.create(32), sampler = ImageSampler('clamp', 'clamp', 'bilinear'),
        time = 0, vm = nil, init = init, advance = advance, draw = draw}
end
