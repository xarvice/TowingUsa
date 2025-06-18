// Dynamic services array
const services = [
  {
    title: "Car Towing",
    description: "24/7 reliable car towing service.",
    icon: "🚗"
  },
  {
    title: "Battery Jumpstart",
    description: "Dead battery? We’ll start it for you.",
    icon: "🔋"
  },
  {
    title: "Fuel Delivery",
    description: "Out of fuel? We deliver on-site.",
    icon: "⛽"
  },
  {
    title: "Flat Tyre Assistance",
    description: "Get help with flat tyres anywhere.",
    icon: "🛞"
  }
];

// Inject services into DOM
const container = document.getElementById('services-container');

services.forEach(service => {
  const card = document.createElement('div');
  card.className = 'service-card';
  card.innerHTML = `
    <div class="icon">${service.icon}</div> 
    <h3>${service.title}</h3>
    <p>${service.description}</p>
  `;
  container.appendChild(card);
});

// Contact form submit handler
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Message sent! (This is a static demo)");
  this.reset();
});
function toggleEmergencyCall() {
    window.location.href = "tel:+18005551234";
}
