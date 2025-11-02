class MapManager {
    constructor() {
        this.maps = new Map();
        this.defaultLocation = [39.9042, 116.4074]; // Beijing coordinates
        this.defaultZoom = 13;
        this.currentLocation = null;
    }

    async initMap(containerId, options = {}) {
        try {
            // Clear existing map if it exists
            if (this.maps.has(containerId)) {
                this.destroyMap(containerId);
            }

            const mapContainer = document.getElementById(containerId);
            if (!mapContainer) {
                throw new Error(`Map container #${containerId} not found`);
            }

            // Create map instance
            const map = L.map(containerId).setView(this.defaultLocation, this.defaultZoom);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);

            // Store map reference
            this.maps.set(containerId, map);

            // Add sample markers
            await this.addSampleMarkers(map);

            // Try to get user location
            await this.addUserLocationMarker(map);

            return map;

        } catch (error) {
            console.error('Error initializing map:', error);
            HelperUtils.showNotification('Failed to load map', 'error');
            return null;
        }
    }

    async initRunnerMap(containerId) {
        return this.initMap(containerId, { zoom: 12 });
    }

    async addSampleMarkers(map) {
        const sampleTasks = [
            {
                position: [39.9042, 116.4074],
                title: "Supermarket Shopping",
                category: "shopping",
                budget: 50,
                distance: "0.8km",
                urgency: "high"
            },
            {
                position: [39.9142, 116.4174],
                title: "Clean Room",
                category: "home",
                budget: 100,
                distance: "3.8km",
                urgency: "low"
            },
            {
                position: [39.8942, 116.3974],
                title: "Pick Up Package",
                category: "delivery",
                budget: 20,
                distance: "2.5km",
                urgency: "medium"
            }
        ];

        sampleTasks.forEach(task => {
            const icon = this.createTaskIcon(task.category);
            const marker = L.marker(task.position, { icon }).addTo(map);
            
            const popupContent = this.createTaskPopup(task);
            marker.bindPopup(popupContent);
        });
    }

    createTaskIcon(category) {
        const iconConfig = {
            shopping: {
                color: 'blue',
                icon: 'shopping-cart',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-500'
            },
            home: {
                color: 'green',
                icon: 'home',
                bgColor: 'bg-green-100',
                textColor: 'text-green-500'
            },
            delivery: {
                color: 'purple',
                icon: 'truck',
                bgColor: 'bg-purple-100',
                textColor: 'text-purple-500'
            },
            repair: {
                color: 'orange',
                icon: 'tools',
                bgColor: 'bg-orange-100',
                textColor: 'text-orange-500'
            }
        };

        const config = iconConfig[category] || iconConfig.shopping;

        return L.divIcon({
            html: `
                <div class="${config.bgColor} w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <i class="fas fa-${config.icon} ${config.textColor}"></i>
                </div>
            `,
            iconSize: [40, 40],
            className: 'custom-div-icon'
        });
    }

    createTaskPopup(task) {
        const urgencyColors = {
            high: 'red',
            medium: 'yellow',
            low: 'green'
        };

        return `
            <div class="p-2 min-w-48">
                <div class="flex items-start justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">${task.title}</h4>
                    <span class="bg-${urgencyColors[task.urgency]}-100 text-${urgencyColors[task.urgency]}-800 text-xs px-2 py-1 rounded-full">
                        ${task.urgency}
                    </span>
                </div>
                <div class="space-y-1 text-sm text-gray-600">
                    <div class="flex justify-between">
                        <span>Budget:</span>
                        <span class="font-semibold text-green-600">$${task.budget}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Distance:</span>
                        <span>${task.distance}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Category:</span>
                        <span class="capitalize">${task.category}</span>
                    </div>
                </div>
                <button onclick="window.helperApp.showPage('requestDetails')" 
                        class="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition">
                    View Details
                </button>
            </div>
        `;
    }

    async addUserLocationMarker(map) {
        try {
            const location = await HelperUtils.getCurrentLocation();
            this.currentLocation = location;
            
            const userIcon = L.divIcon({
                html: `
                    <div class="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <i class="fas fa-user text-white text-sm"></i>
                    </div>
                `,
                iconSize: [32, 32],
                className: 'custom-div-icon'
            });

            L.marker([location.lat, location.lng], { icon: userIcon })
                .addTo(map)
                .bindPopup('Your current location')
                .openPopup();

            // Center map on user location
            map.setView([location.lat, location.lng], 13);

        } catch (error) {
            console.warn('Could not get user location:', error);
            // Continue without user location
        }
    }

    addTaskMarker(map, task) {
        const icon = this.createTaskIcon(task.category);
        const marker = L.marker([task.location.lat, task.location.lng], { icon })
            .addTo(map)
            .bindPopup(this.createTaskPopup(task));
        
        return marker;
    }

    centerMapOnLocation(containerId, lat, lng, zoom = 13) {
        const map = this.maps.get(containerId);
        if (map) {
            map.setView([lat, lng], zoom);
        }
    }

    fitMapToMarkers(containerId) {
        const map = this.maps.get(containerId);
        if (map) {
            const group = new L.featureGroup();
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    group.addLayer(layer);
                }
            });
            
            if (group.getLayers().length > 0) {
                map.fitBounds(group.getBounds().pad(0.1));
            }
        }
    }

    destroyMap(containerId) {
        const map = this.maps.get(containerId);
        if (map) {
            map.remove();
            this.maps.delete(containerId);
        }
    }

    getCurrentLocation() {
        return this.currentLocation;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    }
}

// Initialize map manager
window.MapManager = new MapManager();