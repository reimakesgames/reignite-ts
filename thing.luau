local RunService = game:GetService("RunService")

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

	return { xArm, yArm, zArm }
end

local function ToFixed(num: number, decimalPlaces: number)
	local mult = 10 ^ (decimalPlaces or 0)
	local str = tostring(math.floor(num * mult + 0.5) / mult)
	local negative = str:find("-", 1, true)
	local p = str:find(".", 1, true)
	if not p then
		str = str .. "." .. string.rep("0", decimalPlaces)
	else
		local endDecimals = str:sub(p + 1, -1)
		if #endDecimals < decimalPlaces then
			str = str .. string.rep("0", decimalPlaces - #endDecimals)
		end
	end
	-- append negative sign again
	if negative then
		str = "-" .. str
	end
	return str
end

local function PrintTableValues(t)
	local ENTRY_WIDTH = 8
	local function pad(str: string, len: number)
		return str .. string.rep(" ", len - #str)
	end
	local function padNum(num: number, len: number)
		return pad(tostring(num), len)
	end
	local tableStr = ""
	for i, v in ipairs(t) do
		tableStr = tableStr .. padNum(ToFixed(v, 2), ENTRY_WIDTH)
		if i % 3 == 0 then
			print(tableStr)
			tableStr = ""
		end
	end
end

local function PrintCFrameIJKHatInTableForm(cf: CFrame)
	local i = cf.RightVector
	local j = cf.UpVector
	local k = -cf.LookVector
	PrintTableValues({ i.X, i.Y, i.Z })
	PrintTableValues({ j.X, j.Y, j.Z })
	PrintTableValues({ k.X, k.Y, k.Z })
end

local function PrintCFramePositionInTableForm(cf: CFrame)
	local p = cf.Position
	PrintTableValues({ p.X, p.Y, p.Z })
end

local PreviousArms = {}
local PreviousInvertedArms = {}
local PreviousResettedArms = {}

local Offset = CFrame.lookAt(Vector3.new(4, 0, 0), Vector3.new(0, 0, 0), Vector3.new(0, 1, 0))
local Inverse = Offset:Inverse()

RunService.Stepped:Connect(function(t, dt)
	if #PreviousArms ~= 0 then
		-- delete
		for _, v in ipairs(PreviousArms) do
			v:Destroy()
		end
		for _, v in ipairs(PreviousInvertedArms) do
			v:Destroy()
		end
		for _, v in ipairs(PreviousResettedArms) do
			v:Destroy()
		end
	end
	PreviousArms = GenerateArmsForCFrame(Offset)
	PreviousInvertedArms = GenerateArmsForCFrame(Inverse)
	PreviousResettedArms = GenerateArmsForCFrame(Offset * Inverse)
end)

print("Offset:")
PrintCFramePositionInTableForm(Offset)

print("Inverse:")
PrintCFramePositionInTableForm(Inverse)
