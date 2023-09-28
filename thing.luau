local function Arm(pos: Vector3, dir: Vector3, up: Vector3)
	local arm = Instance.new("Part")
	arm.Size = Vector3.new(0.1, 0.1, 1)
	arm.CFrame = CFrame.lookAt(pos + (dir.Unit * 0.5), pos + dir, up)
	arm.Anchored = true
	return arm
end

local function GenerateArmsForCFrame(cframe: CFrame)
	local xArm = Arm(cframe.Position, cframe.RightVector, cframe.UpVector)
	local yArm = Arm(cframe.Position, cframe.UpVector, cframe.UpVector)
	local zArm = Arm(cframe.Position, -cframe.LookVector, cframe.UpVector)
	xArm.Color = Color3.fromRGB(255, 0, 0)
	yArm.Color = Color3.fromRGB(0, 255, 0)
	zArm.Color = Color3.fromRGB(0, 0, 255)
	xArm.Parent = workspace
	yArm.Parent = workspace
	zArm.Parent = workspace

	return xArm, yArm, zArm
end

local function ToFixed(n, fixed)
	return math.floor(n * 10 ^ fixed) / 10 ^ fixed
end

local Offset = CFrame.lookAt(Vector3.new(0, 0, 0), -Vector3.new(2, 2, 2))
local Inversed = Offset:Inverse()

print("Offset: ")
print("i :", ToFixed(Offset.XVector.X, 2), ToFixed(Offset.XVector.Y, 2), ToFixed(Offset.XVector.Z, 2))
print("j :", ToFixed(Offset.YVector.X, 2), ToFixed(Offset.YVector.Y, 2), ToFixed(Offset.YVector.Z, 2))
print("k :", ToFixed(Offset.ZVector.X, 2), ToFixed(Offset.ZVector.Y, 2), ToFixed(Offset.ZVector.Z, 2))

print("Inversed: ")
print("i :", ToFixed(Inversed.XVector.X, 2), ToFixed(Inversed.XVector.Y, 2), ToFixed(Inversed.XVector.Z, 2))
print("j :", ToFixed(Inversed.YVector.X, 2), ToFixed(Inversed.YVector.Y, 2), ToFixed(Inversed.YVector.Z, 2))
print("k :", ToFixed(Inversed.ZVector.X, 2), ToFixed(Inversed.ZVector.Y, 2), ToFixed(Inversed.ZVector.Z, 2))

while true do
	local xArm, yArm, zArm = GenerateArmsForCFrame(Offset)
	task.wait(1)
	xArm:Destroy()
	yArm:Destroy()
	zArm:Destroy()
	xArm, yArm, zArm = GenerateArmsForCFrame(Inversed)
	task.wait(1)
	xArm:Destroy()
	yArm:Destroy()
	zArm:Destroy()
end
