var currentTarget;

export function CurrentTarget(target) {
    if(target != null)
        currentTarget = target;
    else
        currentTarget = null;
}

export function GetCurrentTarget() {
    return currentTarget
}

export function MapInterval(val, srcMin, srcMax, dstMin, dstMax)
{
    if (val >= srcMax) return dstMax;
    if (val <= srcMin) return dstMin;
    return dstMin + (val - srcMin) / (srcMax - srcMin) * (dstMax - dstMin);
}