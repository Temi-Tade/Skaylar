// the Catmull-Rom method is used to get a curve between two points using the ppints before and after it as "control points"

function clamp(v, min, max) { 
    return Math.max(min, Math.min(max, v));
}

export default function pointsToSmoothPath(points) {
    if (points.length < 2) return `M ${points[0]}`;
    
    const pts = points.map(p => p.split(' ').map(Number));
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;

        const c1x = clamp(p1[0] + (p2[0] - p0[0]) / 6, 0, 300);
        const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6, 0, 300);
        const c2x = clamp(p2[0] - (p3[0] - p1[0]) / 6, 0, 300);
        const c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6, 0, 300);

        d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0]} ${p2[1]}`;
    }
    return d;
}