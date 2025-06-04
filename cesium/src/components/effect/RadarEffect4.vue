<template>
    <div>
        <div id="cesiumContainer" style="width: 100%; height: 600px;"></div>
        <div style="padding: 10px; background: #eee;">
            <label>
                朝向（heading）: {{ heading }}°
                <input type="range" min="0" max="360" v-model.number="heading" @input="updateSector" />
            </label>
            <label style="margin-left: 20px;">
                张角（angle）: {{ angle }}°
                <input type="range" min="1" max="180" v-model.number="angle" @input="updateSector" />
            </label>
            <label style="margin-left: 20px;">
                俯仰（pitch）: {{ pitch }}°
                <input type="range" min="-90" max="90" v-model.number="pitch" @input="updateSector" />
            </label>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            viewer: null,
            sectorEntity: null,

            centerLon: 116.391,
            centerLat: 39.907,
            height: 1000,
            radius: 2000,

            heading: 90,
            angle: 60,
            pitch: 0,
        };
    },
    mounted() {
        this.initCesium();
    },
    methods: {
        initCesium() {
            this.viewer = new Cesium.Viewer("cesiumContainer", {
                imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }),
            });

            this.viewer.imageryLayers.addImageryProvider(
                new Cesium.GridImageryProvider({
                    color: Cesium.Color.YELLOW,
                    cellAlpha: 0.3,
                    lineCount: 36,
                    lineThickness: 1.0,
                })
            );

            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(this.centerLon, this.centerLat, this.height + 4000),
                orientation: { pitch: Cesium.Math.toRadians(-45) },
            });

            this.drawSector();
        },

        drawSector() {
            const positions = this.computeSectorPositions(
                this.centerLon,
                this.centerLat,
                this.height,
                this.radius,
                this.heading,
                this.angle,
                this.pitch
            );

            this.sectorEntity = this.viewer.entities.add({
                polyline: {
                    positions,
                    width: 3,
                    material: Cesium.Color.RED,
                    clampToGround: false,
                },
            });
        },

        updateSector() {
            if (this.sectorEntity) {
                const positions = this.computeSectorPositions(
                    this.centerLon,
                    this.centerLat,
                    this.height,
                    this.radius,
                    this.heading,
                    this.angle,
                    this.pitch
                );
                this.sectorEntity.polyline.positions = positions;
            }
        },

        computeSectorPositions(lon, lat, height, radius, headingDeg, angleDeg, pitchDeg) {
            const center = Cesium.Cartesian3.fromDegrees(lon, lat, height);
            const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);

            const angleRad = Cesium.Math.toRadians(angleDeg);
            const halfAngle = angleRad / 2;

            const headingRad = Cesium.Math.toRadians(headingDeg);
            const pitchRad = Cesium.Math.toRadians(pitchDeg);

            const segmentCount = 64;

            const localPoints = [new Cesium.Cartesian3(0, 0, 0)];

            for (let i = 0; i <= segmentCount; i++) {
                const t = i / segmentCount;
                const offset = -halfAngle + t * angleRad;

                // 在默认朝北方向（ENU 的 Y 轴）构建一个扇形点
                const theta = offset;
                const x = radius * Math.sin(theta);
                const y = radius * Math.cos(theta);
                const z = 0;

                localPoints.push(new Cesium.Cartesian3(x, y, z));
            }

            localPoints.push(new Cesium.Cartesian3(0, 0, 0));

            // === 旋转部分 ===

            // 1. heading：绕 ENU 的 Z 轴旋转
            const headingQuat = Cesium.Quaternion.fromAxisAngle(
                new Cesium.Cartesian3(0, 0, 1),
                headingRad
            );

            const headingMatrix = Cesium.Matrix3.fromQuaternion(headingQuat);

            // 2. 计算 forward（朝向方向）
            const forward = Cesium.Matrix3.multiplyByVector(
                headingMatrix,
                new Cesium.Cartesian3(0, 1, 0), // 北方向
                new Cesium.Cartesian3()
            );

            // 3. pitch：绕 “正交于 forward 和 ENU 上方向” 的 X' 轴旋转
            const right = Cesium.Cartesian3.cross(
                forward,
                new Cesium.Cartesian3(0, 0, 1),
                new Cesium.Cartesian3()
            );
            Cesium.Cartesian3.normalize(right, right);

            const pitchQuat = Cesium.Quaternion.fromAxisAngle(right, pitchRad);
            const pitchMatrix = Cesium.Matrix3.fromQuaternion(pitchQuat);

            // 4. 合并两个旋转矩阵
            const combinedMatrix = Cesium.Matrix3.multiply(pitchMatrix, headingMatrix, new Cesium.Matrix3());

            // 5. 应用旋转，并转换到世界坐标
            return localPoints.map(p => {
                const rotated = Cesium.Matrix3.multiplyByVector(combinedMatrix, p, new Cesium.Cartesian3());
                return Cesium.Matrix4.multiplyByPoint(enuMatrix, rotated, new Cesium.Cartesian3());
            });
        }

    },
};
</script>

<style>
#cesiumContainer {
    position: relative;
}
</style>