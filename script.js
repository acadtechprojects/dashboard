// Dashboard Navigation and Interactivity
// GitHub Pages compatibility check
const isGitHubPages = window.location.hostname.includes('github.io') || window.location.hostname.includes('github.com');

document.addEventListener('DOMContentLoaded', function() {
    // Check if on GitHub Pages and show password modal
    if (isGitHubPages) {
        // Show password modal after a short delay to ensure DOM is ready
        setTimeout(() => {
            showInitialPasswordModal();
        }, 100);
    }
    
    // Add delay for GitHub Pages to ensure all resources are loaded
    const initDelay = isGitHubPages ? 500 : 0;
    
    setTimeout(() => {
        // Only initialize if not on GitHub Pages
        // For GitHub Pages, initialization will happen after password is entered
        if (!isGitHubPages) {
            // Initialize the dashboard
            initializeDashboard();
            
            // Set up navigation
            setupNavigation();
            
            // Set up accordion functionality
            setupAccordion();
            
            // Set up new accordion functionality
            setupNewAccordion();
            
            // Set up project status accordion
            setupStatusAccordion();
            
            // Set up archive panel
            setupArchivePanel();
            
            
            // Set up tooltips
            setupTooltips();
            
            // Set up hover effects
            setupHoverEffects();
            
            // Set up charts
            setupCharts();
            
                // Set up BoT Reso timeline
                setupBotResoTimeline();
                
                // Set current date
                setCurrentDate();
            
            // Also set date after a short delay to ensure DOM is fully loaded
            setTimeout(setCurrentDate, 100);
        }
    }, initDelay);
});

function initializeDashboard() {
    // Show the first dashboard by default (Project Pillars)
    const firstView = document.querySelector('.dashboard-view');
    if (firstView) {
        firstView.classList.add('active');
    }
    
    // Set up the first nav button as active (Project Pillars)
    const firstNavBtn = document.querySelector('.nav-btn');
    if (firstNavBtn) {
        firstNavBtn.classList.add('active');
    }
    
    // Initialize the pillars dashboard with multiple attempts
    setTimeout(initPillarsDashboard, 100);
    setTimeout(initPillarsDashboard, 500);
    setTimeout(initPillarsDashboard, 1000);
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
    const dashboardViews = document.querySelectorAll('.dashboard-view');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    // Protected pages that require password
    const protectedPages = ['cunyai', 'pm', 'oem'];
    
    // Handle dropdown menu visibility
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        const menu = dropdown.querySelector('.nav-dropdown-menu');
        
        if (toggle && menu) {
            // Show on hover
            dropdown.addEventListener('mouseenter', function() {
                menu.style.display = 'block';
            });
            
            // Hide when mouse leaves
            dropdown.addEventListener('mouseleave', function() {
                menu.style.display = 'none';
            });
            
            // Also handle click for mobile/touch devices
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const isVisible = menu.style.display === 'block';
                // Close all other dropdowns
                dropdowns.forEach(d => {
                    const m = d.querySelector('.nav-dropdown-menu');
                    if (m && m !== menu) {
                        m.style.display = 'none';
                    }
                });
                menu.style.display = isVisible ? 'none' : 'block';
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.nav-dropdown-menu');
                if (menu) {
                    menu.style.display = 'none';
                }
            });
        }
    });
    
    // Handle regular nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const targetView = this.getAttribute('data-view');
            if (!targetView) return; // Skip if no data-view attribute
            
            // Check if page is protected
            if (protectedPages.includes(targetView)) {
                e.preventDefault();
                showPasswordModal(targetView, button);
                return;
            }
            
            // Remove active class from all nav buttons and dropdown items
            navButtons.forEach(btn => btn.classList.remove('active'));
            dropdownItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            handleViewSwitch(targetView);
        });
    });
    
    // Handle dropdown items
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const targetView = this.getAttribute('data-view');
            
            // Close the dropdown menu
            const dropdown = this.closest('.nav-dropdown');
            if (dropdown) {
                const menu = dropdown.querySelector('.nav-dropdown-menu');
                if (menu) {
                    menu.style.display = 'none';
                }
            }
            
            // Check if page is protected
            if (protectedPages.includes(targetView)) {
                e.preventDefault();
                showPasswordModal(targetView, item);
                return;
            }
            
            // Remove active class from all nav buttons and dropdown items
            navButtons.forEach(btn => btn.classList.remove('active'));
            dropdownItems.forEach(dItem => dItem.classList.remove('active'));
            
            // Add active class to clicked dropdown item
            this.classList.add('active');
            
            handleViewSwitch(targetView);
        });
    });
}

// Password Protection Functions
let pendingViewSwitch = null;
let pendingButton = null;
let isInitialPageAccess = false;

function showPasswordModal(targetView, button) {
    pendingViewSwitch = targetView;
    pendingButton = button;
    
    const modal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const errorDiv = document.getElementById('password-error');
    
    // Reset modal state
    errorDiv.textContent = '';
    passwordInput.value = '';
    modal.classList.add('show');
    passwordInput.focus();
    
    // Remove any existing event listeners by removing and re-adding
    const submitBtn = document.getElementById('password-submit');
    const cancelBtn = document.getElementById('password-cancel');
    const closeBtn = document.getElementById('password-modal-close');
    
    // Remove old handlers
    const newSubmitBtn = submitBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newCloseBtn = closeBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    // Update references
    const submitBtnNew = document.getElementById('password-submit');
    const cancelBtnNew = document.getElementById('password-cancel');
    const closeBtnNew = document.getElementById('password-modal-close');
    
    // Submit handler
    const handleSubmit = () => {
        const password = passwordInput.value.trim();
        if (password === 'OAII') {
            // Correct password - proceed with navigation
            modal.classList.remove('show');
            proceedWithNavigation();
        } else {
            // Incorrect password
            errorDiv.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    };
    
    // Cancel handler
    const handleCancel = () => {
        modal.classList.remove('show');
        pendingViewSwitch = null;
        pendingButton = null;
        passwordInput.value = '';
        errorDiv.textContent = '';
    };
    
    // Add event listeners
    submitBtnNew.addEventListener('click', handleSubmit);
    cancelBtnNew.addEventListener('click', handleCancel);
    closeBtnNew.addEventListener('click', handleCancel);
    
    // Handle Enter key in password input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    
    passwordInput.onkeydown = handleKeyDown;
    
    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) {
            handleCancel();
        }
    };
}

function proceedWithNavigation() {
    // Handle initial page access (GitHub protection)
    if (isInitialPageAccess) {
        isInitialPageAccess = false;
        // Page is now unlocked, allow normal operation
        return;
    }
    
    // Handle regular navigation
    if (!pendingViewSwitch || !pendingButton) return;
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
    
    // Remove active class from all nav buttons and dropdown items
    navButtons.forEach(btn => btn.classList.remove('active'));
    dropdownItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to clicked button
    pendingButton.classList.add('active');
    
    handleViewSwitch(pendingViewSwitch);
    
    // Reset pending values
    pendingViewSwitch = null;
    pendingButton = null;
}

function showInitialPasswordModal() {
    isInitialPageAccess = true;
    
    const modal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const errorDiv = document.getElementById('password-error');
    
    // Check if modal elements exist
    if (!modal || !passwordInput || !errorDiv) {
        console.error('Password modal elements not found');
        return;
    }
    
    // Reset modal state
    errorDiv.textContent = '';
    passwordInput.value = '';
    modal.classList.add('show');
    passwordInput.focus();
    
    // Hide all dashboard content until password is entered
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
        dashboardContainer.style.display = 'none';
    }
    
    // Remove any existing event listeners by removing and re-adding
    const submitBtn = document.getElementById('password-submit');
    const cancelBtn = document.getElementById('password-cancel');
    const closeBtn = document.getElementById('password-modal-close');
    
    // Check if buttons exist
    if (!submitBtn || !cancelBtn || !closeBtn) {
        console.error('Password modal buttons not found');
        return;
    }
    
    // Remove old handlers
    const newSubmitBtn = submitBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newCloseBtn = closeBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    // Update references
    const submitBtnNew = document.getElementById('password-submit');
    const cancelBtnNew = document.getElementById('password-cancel');
    const closeBtnNew = document.getElementById('password-modal-close');
    
    // Submit handler
    const handleSubmit = () => {
        const password = passwordInput.value.trim();
        if (password === 'OAII') {
            // Correct password - unlock the page
            modal.classList.remove('show');
            if (dashboardContainer) {
                dashboardContainer.style.display = '';
            }
            proceedWithNavigation();
            
            // Initialize dashboard after password is entered
            initializeDashboard();
            setupNavigation();
            setupAccordion();
            setupNewAccordion();
            setupStatusAccordion();
            setupArchivePanel();
            setupTooltips();
            setupHoverEffects();
            setupCharts();
            setupBotResoTimeline();
            setCurrentDate();
            setTimeout(setCurrentDate, 100);
        } else {
            // Incorrect password
            errorDiv.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    };
    
    // Cancel handler - prevent closing on initial access
    const handleCancel = () => {
        // Don't allow closing the modal on initial access
        errorDiv.textContent = 'Password required to access this site.';
        passwordInput.focus();
    };
    
    // Add event listeners
    submitBtnNew.addEventListener('click', handleSubmit);
    cancelBtnNew.addEventListener('click', handleCancel);
    closeBtnNew.addEventListener('click', handleCancel);
    
    // Handle Enter key in password input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    
    passwordInput.onkeydown = handleKeyDown;
    
    // Prevent closing on background click for initial access
    modal.onclick = (e) => {
        if (e.target === modal) {
            errorDiv.textContent = 'Password required to access this site.';
            passwordInput.focus();
        }
    };
}

function handleViewSwitch(targetView) {
    const dashboardViews = document.querySelectorAll('.dashboard-view');
    
    // Hide all dashboard views
    dashboardViews.forEach(view => view.classList.remove('active'));
    
    // Show target view
    const targetDashboard = document.getElementById(targetView);
    if (targetDashboard) {
        targetDashboard.classList.add('active');
        
        // Initialize specific dashboard if needed
        if (targetView === 'pillars') {
            setTimeout(initPillarsDashboard, 100);
        } else if (targetView === 'slate') {
            setTimeout(drawNewCharts, 100);
        } else if (targetView === 'pm') {
            setTimeout(() => {
                if (window.initPMDashboard) {
                    window.initPMDashboard();
                } else {
                    console.warn('PM Dashboard initialization function not available yet');
                    setTimeout(() => {
                        if (window.initPMDashboard) {
                            window.initPMDashboard();
                        }
                    }, 500);
                }
            }, 300);
        } else if (targetView === 'oem') {
            setTimeout(() => {
                if (typeof initOEMDashboard === 'function') {
                    initOEMDashboard();
                } else {
                    console.warn('OEM Dashboard initialization function not available yet');
                    setTimeout(() => {
                        if (typeof initOEMDashboard === 'function') {
                            initOEMDashboard();
                        }
                    }, 500);
                }
            }, 100);
        } else if (targetView === 'degreeworks') {
            setTimeout(() => {
                // Re-initialize status accordions to ensure the collaboration accordion is set up
                setupStatusAccordion();
            }, 100);
        }
        
        // Set current date when switching views
        setCurrentDate();
        
        // Add a subtle animation
        targetDashboard.style.opacity = '0';
        targetDashboard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetDashboard.style.opacity = '1';
            targetDashboard.style.transform = 'translateY(0)';
        }, 50);
    }
}

function setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const panel = item.querySelector('.accordion-panel');
        
        if (trigger && panel) {
            trigger.addEventListener('click', function() {
                const isExpanded = item.getAttribute('aria-expanded') === 'true';
                
                // Close all other accordion items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                item.setAttribute('aria-expanded', !isExpanded);
            });
        }
    });
}

function setupTooltips() {
    const tooltip = document.getElementById('tooltip');
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText) {
                showTooltip(e, tooltipText);
            }
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
        
        element.addEventListener('mousemove', function(e) {
            if (tooltip.classList.contains('show')) {
                updateTooltipPosition(e);
            }
        });
    });
}

function showTooltip(e, text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = text;
    tooltip.classList.add('show');
    
    updateTooltipPosition(e);
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('show');
}

function updateTooltipPosition(e) {
    const tooltip = document.getElementById('tooltip');
    const x = e.clientX + 10;
    const y = e.clientY - 10;
    
    // Ensure tooltip stays within viewport
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let finalX = x;
    let finalY = y;
    
    if (x + tooltipRect.width > viewportWidth) {
        finalX = e.clientX - tooltipRect.width - 10;
    }
    
    if (y - tooltipRect.height < 0) {
        finalY = e.clientY + 20;
    }
    
    tooltip.style.left = finalX + 'px';
    tooltip.style.top = finalY + 'px';
}

function setupHoverEffects() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.flow-card, .setup-card, .milestone-card, .update-card, .fafsa-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.12)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,.05)';
        });
    });
}

function setupCharts() {
    // Set up HTML-based charts with tooltips
    setupDataVisualizationInteractions();
    
    // GitHub Pages compatibility - retry chart drawing if initial attempt fails
    setTimeout(() => {
        const goLiveCanvas = document.getElementById('goLiveChart');
        const funnelCanvas = document.getElementById('funnelChart');
        
        if (goLiveCanvas && funnelCanvas) {
            try {
                drawGoLiveChart(goLiveCanvas);
                drawFunnelChart(funnelCanvas);
            } catch (error) {
                console.warn('Chart drawing failed, retrying...', error);
                // Retry after a longer delay
                setTimeout(() => {
                    drawGoLiveChart(goLiveCanvas);
                    drawFunnelChart(funnelCanvas);
                }, 1000);
            }
        }
    }, isGitHubPages ? 1000 : 100);
}

function setupDataVisualizationInteractions() {
    // Add enhanced tooltips for bar chart
    const barWrappers = document.querySelectorAll('.bar-wrapper');
    barWrappers.forEach(wrapper => {
        wrapper.addEventListener('mouseenter', function(e) {
            const tooltip = this.getAttribute('data-tooltip');
            if (tooltip) {
                showTooltip(e, tooltip);
            }
        });
        
        wrapper.addEventListener('mouseleave', function() {
            hideTooltip();
        });
        
        wrapper.addEventListener('mousemove', function(e) {
            if (document.getElementById('tooltip').classList.contains('show')) {
                updateTooltipPosition(e);
            }
        });
    });
    
    // Add enhanced tooltips for funnel chart segments
    const barSegments = document.querySelectorAll('.bar-segment');
    barSegments.forEach(segment => {
        segment.addEventListener('mouseenter', function(e) {
            const tooltip = this.getAttribute('data-tooltip');
            const college = this.closest('.funnel-bar-wrapper').getAttribute('data-college');
            if (tooltip) {
                const enhancedTooltip = `${college}: ${tooltip}`;
                showTooltip(e, enhancedTooltip);
            }
        });
        
        segment.addEventListener('mouseleave', function() {
            hideTooltip();
        });
        
        segment.addEventListener('mousemove', function(e) {
            if (document.getElementById('tooltip').classList.contains('show')) {
                updateTooltipPosition(e);
            }
        });
    });
    
    // Add enhanced tooltips for funnel chart wrappers (college summary)
    const funnelWrappers = document.querySelectorAll('.funnel-bar-wrapper');
    funnelWrappers.forEach(wrapper => {
        wrapper.addEventListener('mouseenter', function(e) {
            const college = this.getAttribute('data-college');
            const segments = this.querySelectorAll('.bar-segment');
            let summary = `${college} Summary:\n`;
            
            segments.forEach(segment => {
                const tooltip = segment.getAttribute('data-tooltip');
                if (tooltip) {
                    summary += `• ${tooltip}\n`;
                }
            });
            
            showTooltip(e, summary.trim());
        });
        
        wrapper.addEventListener('mouseleave', function() {
            hideTooltip();
        });
        
        wrapper.addEventListener('mousemove', function(e) {
            if (document.getElementById('tooltip').classList.contains('show')) {
                updateTooltipPosition(e);
            }
        });
    });
    
    // Add enhanced hover effects for chart elements
    setupChartHoverEffects();
}

function drawGoLiveChart(canvas) {
    // GitHub Pages compatibility check
    if (!canvas || !canvas.getContext) {
        console.warn('Canvas not available, skipping chart drawing');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Ensure canvas is properly sized
    if (canvas.width === 0 || canvas.height === 0) {
        canvas.width = canvas.offsetWidth || 400;
        canvas.height = canvas.offsetHeight || 200;
    }
    const data = [
        { date: '9/10/2025', colleges: 1 },
        { date: '9/15/2025', colleges: 2 },
        { date: '9/16/2025', colleges: 1 },
        { date: '9/18/2025', colleges: 1 },
        { date: '9/22/2025', colleges: 3 },
        { date: '9/24/2025', colleges: 1 },
        { date: '9/29/2025', colleges: 2 },
    ];
    
    const maxValue = Math.max(...data.map(d => d.colleges));
    const barWidth = canvas.width / data.length * 0.8;
    const barSpacing = canvas.width / data.length * 0.2;
    const chartHeight = canvas.height - 60;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    data.forEach((item, index) => {
        const x = index * (barWidth + barSpacing) + barSpacing / 2;
        const barHeight = (item.colleges / maxValue) * chartHeight;
        const y = canvas.height - 40 - barHeight;
        
        // Draw bar
        ctx.fillStyle = '#FFB71B';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#0033A1';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.colleges.toString(), x + barWidth / 2, y - 5);
        
        // Draw date label
        ctx.fillStyle = '#5f6b7a';
        ctx.font = '10px Arial';
        ctx.fillText(item.date.substring(5), x + barWidth / 2, canvas.height - 20);
    });
}

function drawFunnelChart(canvas) {
    // GitHub Pages compatibility check
    if (!canvas || !canvas.getContext) {
        console.warn('Canvas not available, skipping chart drawing');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Ensure canvas is properly sized
    if (canvas.width === 0 || canvas.height === 0) {
        canvas.width = canvas.offsetWidth || 400;
        canvas.height = canvas.offsetHeight || 200;
    }
    const data = [
        { college: 'Baruch', created: 2732, fee: 727, ready: 521, submitted: 806 },
        { college: 'Brooklyn', created: 1797, fee: 490, ready: 168, submitted: 571 },
        { college: 'City', created: 1925, fee: 300, ready: 192, submitted: 416 },
        { college: 'CSI', created: 297, fee: 297, ready: 35, submitted: 83 },
        { college: 'GC', created: 2774, fee: 192, ready: 55, submitted: 268 },
        { college: 'Hunter', created: 3563, fee: 839, ready: 585, submitted: 902 },
        { college: 'John Jay', created: 1123, fee: 245, ready: 171, submitted: 274 },
        { college: 'Lehman', created: 737, fee: 169, ready: 71, submitted: 188 },
        { college: 'Queens', created: 1036, fee: 255, ready: 116, submitted: 281 },
        { college: 'SLU', created: 56, fee: 12, ready: 2, submitted: 16 },
        { college: 'York', created: 46, fee: 4, ready: 0, submitted: 10 },
    ];
    
    const maxValue = Math.max(...data.map(d => d.created));
    const barWidth = canvas.width / data.length * 0.8;
    const barSpacing = canvas.width / data.length * 0.2;
    const chartHeight = canvas.height - 100;
    const colors = {
        created: '#0033A1',
        fee: '#7DA6FF',
        ready: '#22C55E',
        submitted: '#FFB71B'
    };
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Y-axis labels
    ctx.fillStyle = '#5f6b7a';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    const yLabels = [0, 300, 600, 900, 1200];
    yLabels.forEach((label, index) => {
        const y = canvas.height - 80 - (index * chartHeight / 4);
        ctx.fillText(label.toString(), 40, y + 4);
    });
    
    // Draw grid lines
    ctx.strokeStyle = '#e5eaf0';
    ctx.lineWidth = 1;
    yLabels.forEach((label, index) => {
        const y = canvas.height - 80 - (index * chartHeight / 4);
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(canvas.width - 20, y);
        ctx.stroke();
    });
    
    // Draw bars
    data.forEach((item, index) => {
        const x = 50 + index * (barWidth + barSpacing) + barSpacing / 2;
        let currentY = canvas.height - 80;
        
        // Draw segments in order: created, fee, ready, submitted
        const segments = [
            { key: 'created', value: item.created, color: colors.created },
            { key: 'fee', value: item.fee, color: colors.fee },
            { key: 'ready', value: item.ready, color: colors.ready },
            { key: 'submitted', value: item.submitted, color: colors.submitted }
        ];
        
        segments.forEach(segment => {
            if (segment.value > 0) {
                const segmentHeight = (segment.value / maxValue) * chartHeight;
                currentY -= segmentHeight;
                
                ctx.fillStyle = segment.color;
                ctx.fillRect(x, currentY, barWidth, segmentHeight);
                
                // Draw value on segment - always show numbers
                ctx.fillStyle = 'white';
                ctx.font = 'bold 9px Arial';
                ctx.textAlign = 'center';
                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                ctx.lineWidth = 1;
                
                const textX = x + barWidth / 2;
                const textY = currentY + segmentHeight / 2 + 3;
                
                // Draw text with stroke for better visibility
                ctx.strokeText(segment.value.toString(), textX, textY);
                ctx.fillText(segment.value.toString(), textX, textY);
            }
        });
        
        // Draw college name
        ctx.fillStyle = '#0033A1';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeText(item.college, x + barWidth / 2, canvas.height - 20);
        ctx.fillText(item.college, x + barWidth / 2, canvas.height - 20);
    });
    
    // Draw legend
    const legendY = canvas.height - 40;
    const legendX = 50;
    const legendItems = [
        { label: 'Created', color: colors.created },
        { label: 'Fee Received/Waived', color: colors.fee },
        { label: 'Ready for Review', color: colors.ready },
        { label: 'Submitted', color: colors.submitted }
    ];
    
    let legendXPos = legendX;
    legendItems.forEach((item, index) => {
        // Draw color box
        ctx.fillStyle = item.color;
        ctx.fillRect(legendXPos, legendY - 10, 12, 12);
        
        // Draw label
        ctx.fillStyle = '#0033A1';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, legendXPos + 16, legendY - 2);
        
        legendXPos += ctx.measureText(item.label).width + 30;
    });
}

function setupBotResoTimeline() {
    // Calculate dynamic progress
    const start = new Date(2025, 7, 29); // August 29, 2025
    const totalWeeks = 14;
    const today = new Date();
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const rawWeeks = Math.floor((today.getTime() - start.getTime()) / msPerWeek) + 1;
    const currentWeek = Math.min(Math.max(rawWeeks, 0), totalWeeks);
    const percent = Math.round((currentWeek / totalWeeks) * 100);
    
    // Update progress display
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    
    if (progressText) {
        progressText.textContent = `${percent}% · Week ${currentWeek} of ${totalWeeks}`;
    }
    
    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }
    
    // Handle week card interactions
    const weekCards = document.querySelectorAll('.week-card');
    
    weekCards.forEach(card => {
        const summary = card.querySelector('.week-summary');
        
        if (summary) {
            summary.addEventListener('click', function() {
                const isOpen = card.classList.contains('open');
                
                // Close all other cards
                weekCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('open');
                    }
                });
                
                // Toggle current card
                card.classList.toggle('open');
            });
        }
    });
}

function setCurrentDate() {
    const dateElement = document.getElementById('status-date');
    const fafsaDateElement = document.getElementById('fafsa-status-date');
    const degreeworksDateElement = document.getElementById('degreeworks-status-date');
    
    // Set specific dates for each page
    const slateDate = '11/11/2025';
    const fafsaDate = '11/6/2025';
    const degreeworksDate = '11/12/2025';
    
    console.log('Setting Slate date to:', slateDate);
    console.log('Setting FAFSA date to:', fafsaDate);
    console.log('Setting DegreeWorks date to:', degreeworksDate);
    
    // Force update with cache busting
    const timestamp = new Date().getTime();
    console.log('Cache busting timestamp:', timestamp);
    
    // Set date for Slate page
    if (dateElement) {
        dateElement.textContent = slateDate;
        dateElement.setAttribute('data-timestamp', timestamp);
        console.log('Slate date element updated with timestamp:', timestamp);
    } else {
        console.log('Slate date element not found');
    }
    
    // Set date for FAFSA page
    if (fafsaDateElement) {
        fafsaDateElement.textContent = fafsaDate;
        fafsaDateElement.setAttribute('data-timestamp', timestamp);
        console.log('FAFSA date element updated with timestamp:', timestamp);
    } else {
        console.log('FAFSA date element not found');
    }
    
    // Set date for DegreeWorks page
    if (degreeworksDateElement) {
        degreeworksDateElement.textContent = degreeworksDate;
        degreeworksDateElement.setAttribute('data-timestamp', timestamp);
        console.log('DegreeWorks date element updated with timestamp:', timestamp);
    } else {
        console.log('DegreeWorks date element not found');
    }
    
    // Force update if elements exist but are empty or have old timestamps
    setTimeout(() => {
        const currentTimestamp = new Date().getTime();
        if (dateElement && (!dateElement.textContent || dateElement.getAttribute('data-timestamp') !== timestamp.toString())) {
            dateElement.textContent = slateDate;
            dateElement.setAttribute('data-timestamp', currentTimestamp);
            console.log('Force updated Slate date with new timestamp:', currentTimestamp);
        }
        if (fafsaDateElement && (!fafsaDateElement.textContent || fafsaDateElement.getAttribute('data-timestamp') !== timestamp.toString())) {
            fafsaDateElement.textContent = fafsaDate;
            fafsaDateElement.setAttribute('data-timestamp', currentTimestamp);
            console.log('Force updated FAFSA date with new timestamp:', currentTimestamp);
        }
    }, 200);
}

// Additional utility functions for enhanced interactivity
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 200);
            }
        });
    });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize additional features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    animateProgressBars();
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Add focus styles for keyboard navigation
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('nav-btn')) {
            focusedElement.style.outline = '2px solid var(--cuny-gold)';
            focusedElement.style.outlineOffset = '2px';
        }
    }
});

// Add window resize handler for responsive behavior
window.addEventListener('resize', function() {
    // Recalculate tooltip positions on window resize
    const tooltip = document.getElementById('tooltip');
    if (tooltip && tooltip.classList.contains('show')) {
        // Hide tooltip on resize to prevent positioning issues
        tooltip.classList.remove('show');
    }
    
    // Redraw charts on resize
    const goLiveCanvas = document.getElementById('goLiveChart');
    const funnelCanvas = document.getElementById('funnelChart');
    
    if (goLiveCanvas) {
        drawGoLiveChart(goLiveCanvas);
    }
    
    if (funnelCanvas) {
        drawFunnelChart(funnelCanvas);
    }
});

// New Accordion Functionality
function setupNewAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item-new');
    
    accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger-new');
        const panel = item.querySelector('.accordion-panel-new');
        
        if (trigger && panel) {
            trigger.addEventListener('click', function() {
                const isExpanded = item.getAttribute('aria-expanded') === 'true';
                
                // Close all other accordion items
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.setAttribute('aria-expanded', 'false');
                        const otherPanel = otherItem.querySelector('.accordion-panel-new');
                        if (otherPanel) {
                            otherPanel.style.display = 'none';
                        }
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    item.setAttribute('aria-expanded', 'false');
                    panel.style.display = 'none';
                } else {
                    item.setAttribute('aria-expanded', 'true');
                    panel.style.display = 'block';
                    
                    // Draw charts when timeline panel is opened
                    if (item.getAttribute('data-id') === 'go-live-timeline') {
                        setTimeout(() => {
                            drawNewCharts();
                        }, 100);
                    }
                }
            });
        }
    });
    
    // Set initial state - first item open by default
    const firstItem = accordionItems[0];
    if (firstItem) {
        firstItem.setAttribute('aria-expanded', 'true');
        const firstPanel = firstItem.querySelector('.accordion-panel-new');
        if (firstPanel) {
            firstPanel.style.display = 'block';
        }
    }
}

// New Chart Drawing Functions
function drawNewCharts() {
    const goLiveCanvas = document.getElementById('goLiveChart');
    const funnelCanvas = document.getElementById('funnelChart');
    
    if (goLiveCanvas) {
        drawNewGoLiveChart(goLiveCanvas);
    }
    
    if (funnelCanvas) {
        drawNewFunnelChart(funnelCanvas);
    }
}

function drawNewGoLiveChart(canvas) {
    const ctx = canvas.getContext('2d');
    const data = [
        { date: '9/10/2025', colleges: 1 },
        { date: '9/15/2025', colleges: 2 },
        { date: '9/16/2025', colleges: 1 },
        { date: '9/18/2025', colleges: 1 },
        { date: '9/22/2025', colleges: 3 },
        { date: '9/24/2025', colleges: 1 },
        { date: '9/29/2025', colleges: 1 },
        { date: '10/3/2025', colleges: 1 }
    ];
    
    const maxValue = Math.max(...data.map(d => d.colleges));
    const chartWidth = canvas.width - 80;
    const chartHeight = canvas.height - 60;
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5eaf0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = 30 + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(40 + chartWidth, y);
        ctx.stroke();
    }
    
    // Draw bars
    data.forEach((item, index) => {
        const x = 40 + index * (barWidth + barSpacing) + barSpacing / 2;
        const barHeight = (item.colleges / maxValue) * chartHeight;
        const y = 30 + chartHeight - barHeight;
        
        // Draw bar
        ctx.fillStyle = '#FFB71B';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#0033A1';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.colleges.toString(), x + barWidth / 2, y - 5);
        
        // Draw date label
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.fillText(item.date, x + barWidth / 2, 30 + chartHeight + 15);
    });
    
    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const value = Math.round((maxValue / 4) * (4 - i));
        const y = 30 + (chartHeight / 4) * i + 3;
        ctx.fillText(value.toString(), 35, y);
    }
}

function drawNewFunnelChart(canvas) {
    const ctx = canvas.getContext('2d');
    const data = [
        { college: 'Baruch', created: 2732, submitted: 806, fee: 727, ready: 521 },
        { college: 'Brooklyn', created: 1797, submitted: 571, fee: 490, ready: 168 },
        { college: 'City', created: 1925, submitted: 416, fee: 300, ready: 192 },
        { college: 'CSI', created: 297, submitted: 83, fee: 297, ready: 35 },
        { college: 'GC', created: 2774, submitted: 268, fee: 192, ready: 55 },
        { college: 'Hunter', created: 3563, submitted: 902, fee: 839, ready: 585 },
        { college: 'John Jay', created: 1123, submitted: 274, fee: 245, ready: 171 },
        { college: 'Lehman', created: 737, submitted: 188, fee: 169, ready: 71 },
        { college: 'Queens', created: 1036, submitted: 281, fee: 255, ready: 116 },
        { college: 'SLU', created: 56, submitted: 16, fee: 12, ready: 2 },
        { college: 'York', created: 46, submitted: 10, fee: 4, ready: 0 },
    ];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;

    // Calculate bar dimensions
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length;
    const maxValue = 1200;

    // Colors for stacked segments
    const colors = {
        created: '#0033A1',      // Dark Blue
        fee: '#7DA6FF',         // Light Blue  
        ready: '#22C55E',       // Green
        submitted: '#FFB71B'     // Orange
    };

    // Draw stacked bars
    data.forEach((item, index) => {
        const x = margin.left + index * barSpacing + (barSpacing - barWidth) / 2;
        let currentY = margin.top + chartHeight;

        // Draw segments from bottom to top
        const segments = [
            { value: item.created, color: colors.created, label: 'Created' },
            { value: item.fee, color: colors.fee, label: 'Fee Received/Waived' },
            { value: item.ready, color: colors.ready, label: 'Ready for Review' },
            { value: item.submitted, color: colors.submitted, label: 'Submitted' }
        ];

        segments.forEach(segment => {
            if (segment.value > 0) {
                const segmentHeight = (segment.value / maxValue) * chartHeight;
                currentY -= segmentHeight;

                // Draw segment
                ctx.fillStyle = segment.color;
                ctx.fillRect(x, currentY, barWidth, segmentHeight);

                // Draw value on segment
                ctx.fillStyle = 'white';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                const textY = currentY + segmentHeight / 2 + 3;
                ctx.fillText(segment.value.toString(), x + barWidth / 2, textY);
            }
        });

        // Draw college name
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.college, x + barWidth / 2, margin.top + chartHeight + 20);
    });

    // Draw Y-axis
    ctx.strokeStyle = '#e5eaf0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    const yLabels = [0, 300, 600, 900, 1200];
    yLabels.forEach(value => {
        const y = margin.top + chartHeight - (value / maxValue) * chartHeight;
        ctx.fillText(value.toString(), margin.left - 10, y + 4);
    });

    // Draw X-axis
    ctx.strokeStyle = '#e5eaf0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    yLabels.forEach(value => {
        const y = margin.top + chartHeight - (value / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();
    });

    // Draw legend
    const legendY = margin.top + chartHeight + 50;
    const legendItems = [
        { color: colors.created, label: 'Created' },
        { color: colors.fee, label: 'Fee Received/Waived' },
        { color: colors.ready, label: 'Ready for Review' },
        { color: colors.submitted, label: 'Submitted' }
    ];

    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    let legendX = margin.left;

    legendItems.forEach((item, index) => {
        // Draw color box
        ctx.fillStyle = item.color;
        ctx.fillRect(legendX, legendY, 15, 15);

        // Draw label
        ctx.fillStyle = '#374151';
        ctx.fillText(item.label, legendX + 20, legendY + 11);

        legendX += ctx.measureText(item.label).width + 40;
    });
}

// Project Pillars Dashboard JavaScript
const PILLARS = [
    { key: 'governance', label: 'Governance', color: '#0033A1', accent: '#1B5FD1' },
    { key: 'process', label: 'Process Mapping', color: '#FFB71B', accent: '#B37E09' },
    { key: 'smes', label: 'Involve the Right SMEs', color: '#1B5FD1', accent: '#0033A1' },
    { key: 'dedication', label: 'Everyone Working with Dedication', color: '#B37E09', accent: '#FFB71B' }
];

let pillarsCanvas, pillarsCtx, pillarsTip, pillarsT0, pillarsState;

function initPillarsDashboard() {
    console.log('Initializing pillars dashboard...');
    
    pillarsCanvas = document.getElementById('orbital');
    if (!pillarsCanvas) {
        console.error('Canvas element with id "orbital" not found');
        return;
    }
    
    console.log('Canvas found:', pillarsCanvas);
    
    try {
        pillarsCtx = pillarsCanvas.getContext('2d');
        if (!pillarsCtx) {
            console.error('Could not get 2D context');
            return;
        }
        
        pillarsTip = document.getElementById('tooltip');
        pillarsT0 = performance.now();
        pillarsState = { particles: [] };
        
        resizePillarsCanvas();
        initPillarsParticles();
        startPillarsAnimation();
        
        // Add event listeners
        pillarsCanvas.addEventListener('mousemove', handlePillarsMouseMove);
        pillarsCanvas.addEventListener('mouseleave', handlePillarsMouseLeave);
        window.addEventListener('resize', resizePillarsCanvas);
        
        console.log('Pillars dashboard initialized successfully');
    } catch (error) {
        console.error('Error initializing pillars dashboard:', error);
    }
}

function resizePillarsCanvas() {
    if (!pillarsCanvas) return;
    
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const parent = pillarsCanvas.parentElement;
    if (!parent) return;
    
    const css = parent.clientWidth;
    if (css <= 0) return;
    
    pillarsCanvas.width = css * dpr;
    pillarsCanvas.height = css * dpr;
    pillarsCanvas.style.width = css + 'px';
    pillarsCanvas.style.height = css + 'px';
    pillarsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    console.log('Canvas resized:', css, 'x', css);
}

function initPillarsParticles(count = 90) {
    pillarsState.particles = Array.from({ length: count }, () => ({
        r: rand(12, 38),
        orbit: rand(80, 330),
        angle: rand(0, Math.PI * 2),
        speed: rand(0.002, 0.006),
        alpha: rand(0.12, 0.35)
    }));
}

function drawPillars(now) {
    if (!pillarsCanvas || !pillarsCtx) {
        console.error('Canvas or context not available');
        return;
    }
    
    const w = pillarsCanvas.clientWidth;
    const h = pillarsCanvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    
    pillarsCtx.clearRect(0, 0, w, h);
    
    const R1 = Math.min(w, h) * 0.15;  // Governance (innermost) - reduced
    const R2 = Math.min(w, h) * 0.25;  // Process Mapping
    const R3 = Math.min(w, h) * 0.35;  // Right SMEs
    const R4 = Math.min(w, h) * 0.45;  // Dedication (outermost) - reduced
    const t = now - pillarsT0;
    const rot = t * 0.00025;
    
    // Draw rings (background circles)
    drawPillarsRing(cx, cy, R4, 'rgba(183,126,9,.12)', 12);  // Dedication ring
    drawPillarsRing(cx, cy, R3, 'rgba(27,95,209,.12)', 12);  // Right SMEs ring
    drawPillarsRing(cx, cy, R2, 'rgba(255,183,27,.12)', 12); // Process Mapping ring
    drawPillarsRing(cx, cy, R1, 'rgba(0,51,161,.12)', 12);  // Governance ring
    
    // Draw orbits (animated circles)
    drawPillarsOrbit(cx, cy, R1, '#0033A1', 3, rot);         // Governance
    drawPillarsOrbit(cx, cy, R2, '#FFB71B', 3, -rot * 1.1);  // Process Mapping
    drawPillarsOrbit(cx, cy, R3, '#1B5FD1', 2, rot * 1.3);   // Right SMEs
    drawPillarsOrbit(cx, cy, R4, '#B37E09', 2, -rot * 0.8);  // Dedication
    
    const nodes = pillarNodes(cx, cy, [R1, R2, R3, R4], rot);
    drawPillarsConnections(nodes);
    nodes.forEach(n => drawPillarsNode(n));
    
    pillarsState.particles.forEach(p => {
        p.angle += p.speed;
        const x = cx + Math.cos(p.angle) * p.orbit;
        const y = cy + Math.sin(p.angle) * p.orbit;
        pillarsCtx.beginPath();
        pillarsCtx.fillStyle = `rgba(27,95,209,${p.alpha})`;
        pillarsCtx.arc(x, y, p.r * 0.02, 0, Math.PI * 2);
        pillarsCtx.fill();
    });
    
    requestAnimationFrame(drawPillars);
}

function drawPillarsRing(x, y, r, stroke, w) {
    pillarsCtx.beginPath();
    pillarsCtx.strokeStyle = stroke;
    pillarsCtx.lineWidth = w;
    pillarsCtx.arc(x, y, r, 0, Math.PI * 2);
    pillarsCtx.stroke();
}

function drawPillarsOrbit(x, y, r, color, w, rotation) {
    pillarsCtx.beginPath();
    pillarsCtx.strokeStyle = color;
    pillarsCtx.globalAlpha = 0.65;
    pillarsCtx.lineWidth = w;
    pillarsCtx.setLineDash([6, 10]);
    pillarsCtx.lineCap = 'round';
    pillarsCtx.arc(x, y, r, 0, Math.PI * 2);
    pillarsCtx.stroke();
    pillarsCtx.setLineDash([]);
    pillarsCtx.globalAlpha = 1;
    
    const a0 = rotation % (Math.PI * 2);
    pillarsCtx.beginPath();
    pillarsCtx.strokeStyle = withPillarsGlow(color, 0.6);
    pillarsCtx.lineWidth = w + 1.5;
    pillarsCtx.arc(x, y, r, a0, a0 + Math.PI / 3);
    pillarsCtx.stroke();
    pillarsCtx.shadowColor = 'transparent';
    pillarsCtx.shadowBlur = 0;
    pillarsCtx.globalAlpha = 1;
}

function drawPillarsConnections(nodes) {
    pillarsCtx.save();
    pillarsCtx.lineWidth = 2;
    pillarsCtx.strokeStyle = 'rgba(0,51,161,.25)';
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            pillarsCtx.beginPath();
            pillarsCtx.moveTo(nodes[i].x, nodes[i].y);
            pillarsCtx.lineTo(nodes[j].x, nodes[j].y);
            pillarsCtx.stroke();
        }
    }
    pillarsCtx.restore();
}

function drawPillarsNode(n) {
    pillarsCtx.beginPath();
    pillarsCtx.fillStyle = 'rgba(255,183,27,.14)';
    pillarsCtx.arc(n.x, n.y, 20, 0, Math.PI * 2);
    pillarsCtx.fill();
    
    pillarsCtx.beginPath();
    pillarsCtx.strokeStyle = '#0033A1';
    pillarsCtx.lineWidth = 2.5;
    pillarsCtx.arc(n.x, n.y, 14, 0, Math.PI * 2);
    pillarsCtx.stroke();
    
    pillarsCtx.beginPath();
    const grad = pillarsCtx.createRadialGradient(n.x - 3, n.y - 3, 2, n.x, n.y, 14);
    grad.addColorStop(0, '#FFB71B');
    grad.addColorStop(1, '#B37E09');
    pillarsCtx.fillStyle = grad;
    pillarsCtx.arc(n.x, n.y, 9, 0, Math.PI * 2);
    pillarsCtx.fill();
    
    pillarsCtx.font = '600 14px ui-sans-serif, system-ui';
    pillarsCtx.fillStyle = '#0b1220';
    pillarsCtx.textAlign = 'center';
    pillarsCtx.textBaseline = 'top';
    wrapPillarsText(n.labelShort, n.x, n.y + 16, 130, 16);
}

function pillarNodes(cx, cy, radii, rot) {
    const base = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
    return PILLARS.map((p, i) => {
        const r = radii[i % radii.length] + (i % 2 === 0 ? -8 : 8);
        const a = base[i] + rot * (i % 2 === 0 ? 1 : -1) * 1.4;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return {
            x, y, r,
            label: p.label,
            color: p.color,
            accent: p.accent,
            labelShort: shortPillarsLabel(p.label)
        };
    });
}

function shortPillarsLabel(str) {
    if (str.includes('Governance')) return 'Governance';
    if (str.includes('Process')) return 'Process Mapping';
    if (str.includes('SMEs')) return 'Right SMEs';
    if (str.includes('Dedication')) return 'Dedication';
    return str;
}

function withPillarsGlow(color, blur) {
    pillarsCtx.shadowColor = color;
    pillarsCtx.shadowBlur = Math.max(6, pillarsCanvas.clientWidth * 0.015 * blur);
    return color;
}

function wrapPillarsText(text, x, y, maxW, lh) {
    const words = text.split(' ');
    let line = '';
    let yy = y;
    for (let i = 0; i < words.length; i++) {
        const test = (line + words[i] + ' ').trim();
        if (pillarsCtx.measureText(test).width > maxW && i > 0) {
            pillarsCtx.fillText(line.trim(), x, yy);
            yy += lh;
            line = '';
        }
        line = test;
    }
    pillarsCtx.fillText(line.trim(), x, yy);
}

function hitPillarsNode(mx, my) {
    const w = pillarsCanvas.clientWidth;
    const h = pillarsCanvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const nodes = pillarNodes(cx, cy, [Math.min(w, h) * 0.15, Math.min(w, h) * 0.25, Math.min(w, h) * 0.35, Math.min(w, h) * 0.45], (performance.now() - pillarsT0) * 0.00025);
    for (const n of nodes) {
        const d = Math.hypot(mx - n.x, my - n.y);
        if (d <= 16) return n;
    }
    return null;
}

function handlePillarsMouseMove(e) {
    const rect = pillarsCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const n = hitPillarsNode(mx, my);
    
    if (n) {
        pillarsTip.style.opacity = 1;
        pillarsTip.textContent = n.label;
        pillarsTip.style.left = (e.clientX + 12) + 'px';
        pillarsTip.style.top = (e.clientY + 12) + 'px';
    } else {
        pillarsTip.style.opacity = 0;
    }
}

function handlePillarsMouseLeave() {
    pillarsTip.style.opacity = 0;
}

function buildPillarsLegend() {
    const legend = document.getElementById('legend');
    if (!legend) return;
    
    legend.innerHTML = '';
    PILLARS.forEach(p => {
        const el = document.createElement('div');
        el.className = 'pillars-pill';
        el.style.setProperty('--c', p.color);
        el.innerHTML = `<span class="dot"></span><span>${p.label}</span>`;
        legend.appendChild(el);
    });
}

function startPillarsAnimation() {
    requestAnimationFrame(drawPillars);
}

const rand = (a, b) => a + Math.random() * (b - a);

// Archive Panel Functionality
function setupArchivePanel() {
    const archiveToggle = document.getElementById('archive-toggle');
    const archivePanel = document.getElementById('archive-panel');
    const archiveClose = document.getElementById('archive-close');
    
    if (archiveToggle && archivePanel) {
        archiveToggle.addEventListener('click', function() {
            const isOpen = archivePanel.style.display === 'block';
            
            if (isOpen) {
                archivePanel.style.display = 'none';
                archiveToggle.classList.remove('active');
            } else {
                archivePanel.style.display = 'block';
                archiveToggle.classList.add('active');
            }
        });
    }
    
    if (archiveClose && archivePanel) {
        archiveClose.addEventListener('click', function() {
            archivePanel.style.display = 'none';
            if (archiveToggle) {
                archiveToggle.classList.remove('active');
            }
        });
    }
    
    // Handle archive item clicks (for items with data-view attributes)
    const archiveItems = document.querySelectorAll('.archive-item[data-view]');
    archiveItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const targetView = this.getAttribute('data-view');
            if (!targetView) return;
            
            // Check if page is protected
            const protectedPages = ['cunyai', 'pm', 'oem'];
            if (protectedPages.includes(targetView)) {
                e.preventDefault();
                // Close archive panel first
                if (archivePanel) {
                    archivePanel.style.display = 'none';
                    if (archiveToggle) {
                        archiveToggle.classList.remove('active');
                    }
                }
                // Show password modal
                showPasswordModal(targetView, this);
                return;
            }
            
            // Close archive panel
            if (archivePanel) {
                archivePanel.style.display = 'none';
                if (archiveToggle) {
                    archiveToggle.classList.remove('active');
                }
            }
            
            // Switch to target view
            handleViewSwitch(targetView);
            
            // Update active nav button
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => btn.classList.remove('active'));
            const targetNavBtn = document.querySelector(`.nav-btn[data-view="${targetView}"]`);
            if (targetNavBtn) {
                targetNavBtn.classList.add('active');
            }
        });
    });
}

// Project Status Accordion Functionality
function setupStatusAccordion() {
    const statusAccordionItems = document.querySelectorAll('.status-accordion-item');
    
    statusAccordionItems.forEach(item => {
        // Skip if already initialized
        if (item.hasAttribute('data-accordion-initialized')) {
            return;
        }
        
        const trigger = item.querySelector('.status-accordion-trigger');
        const panel = item.querySelector('.status-accordion-panel');
        
        if (trigger && panel) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                
                // Toggle current item
                if (isExpanded) {
                    trigger.setAttribute('aria-expanded', 'false');
                    panel.classList.remove('open');
                    panel.style.display = 'none';
                } else {
                    trigger.setAttribute('aria-expanded', 'true');
                    panel.style.display = 'block';
                    // Force reflow to ensure transition works
                    panel.offsetHeight;
                    panel.classList.add('open');
                    
                    // Check if this is the collaboration diagram accordion
                    const accordionType = item.getAttribute('data-status-accordion');
                    if (accordionType === 'team-collaboration') {
                        // Draw collaboration diagram when accordion opens
                        setTimeout(() => {
                            drawCollaborationDiagram();
                        }, 100);
                    }
                    
                    // Animate progress bars when accordion opens
                    setTimeout(() => {
                        animateProgressBars();
                    }, 300);
                }
            });
            
            // Mark as initialized
            item.setAttribute('data-accordion-initialized', 'true');
        }
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    
    progressBars.forEach(bar => {
        // Get the target width from the data attribute or parent
        let targetWidth = bar.style.width || bar.getAttribute('data-width');
        if (!targetWidth) {
            const parent = bar.closest('.progress-bar-item');
            if (parent) {
                const percent = parent.getAttribute('data-percent');
                if (percent) {
                    targetWidth = percent + '%';
                }
            }
        }
        
        // Reset and animate
        bar.style.width = '0%';
        bar.style.transition = 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Use requestAnimationFrame to ensure smooth animation
        requestAnimationFrame(() => {
            setTimeout(() => {
                const parent = bar.closest('.progress-bar-item');
                if (parent) {
                    const percent = parent.getAttribute('data-percent');
                    if (percent) {
                        bar.style.width = percent + '%';
                    } else if (targetWidth) {
                        bar.style.width = targetWidth;
                    }
                }
            }, 50);
        });
    });
}

// DegreeWorks Collaboration Diagram - Modern Version
function drawCollaborationDiagram() {
    const canvas = document.getElementById('collaboration-canvas');
    if (!canvas) return;
    
    let ctx = canvas.getContext('2d');
    const container = document.getElementById('degreeworks-collaboration-diagram');
    if (!container) return;
    
    // Enhanced team data with vibrant colors and modern styling
    const teams = [
        {
            name: 'CIS',
            fullName: 'Computing & Information Services',
            members: [
                { name: 'Mara Bianco', role: 'Tech Project Manager' },
                { name: 'Zev Jeremias', role: 'Technical Lead/Decision Maker for CF' },
                { name: 'Krafins Valcin', role: 'Technical Lead/DW application' },
                { name: 'Amy Baez', role: 'Technical Support DW' },
                { name: 'Yvonne Venezia', role: 'Technical Support CF' },
                { name: 'Youngren Ponnuraj', role: 'Application Dev Lead' },
                { name: 'Rachel Sabb', role: 'Technical and Appl Support DW' }
            ],
            color: '#0033A1',
            accentColor: '#0046C7',
            lightColor: '#0033A120',
            glowColor: '#0033A140'
        },
        {
            name: 'OAII',
            fullName: 'Office of Academic Innovation Implementation',
            members: [
                { name: 'Evan Silberman', role: 'Strategic partner' },
                { name: 'Jetmir Troshani', role: 'Functional Project Manager' }
            ],
            color: '#10b981',
            accentColor: '#059669',
            lightColor: '#10b98120',
            glowColor: '#10b98140'
        },
        {
            name: 'OEM',
            fullName: 'Office of Enrollment Management',
            members: [
                { name: 'Reine Sarmiento', role: 'Project Sponsor' },
                { name: 'Maureen Heacock', role: 'Program Owner' }
            ],
            color: '#f59e0b',
            accentColor: '#d97706',
            lightColor: '#f59e0b20',
            glowColor: '#f59e0b40'
        },
        {
            name: 'OUR',
            fullName: 'Office of the University Registrar',
            members: [
                { name: 'Juline Robinson', role: 'DW SME' },
                { name: 'Doris Wang', role: 'DW SME' },
                { name: 'Tatiana Mejic', role: 'DW SME' }
            ],
            color: '#7c3aed',
            accentColor: '#6d28d9',
            lightColor: '#7c3aed20',
            glowColor: '#7c3aed40'
        },
        {
            name: 'SOL',
            fullName: 'School of Law',
            members: [
                { name: 'Kevin Lin', role: 'DW SME' },
                { name: 'Jonathan Vela Enriquez', role: 'DW SME' }
            ],
            color: '#dc2626',
            accentColor: '#b91c1c',
            lightColor: '#dc262620',
            glowColor: '#dc262640'
        }
    ];
    
    // Modern layout configuration
    const baseBoxWidth = 320;
    const maxBoxWidth = 500;
    const headerHeight = 65;
    const memberLineHeight = 38;
    const padding = 24;
    const borderRadius = 16;
    const horizontalSpacing = 64;
    const verticalSpacing = 180;
    
    const fonts = {
        header: 'bold 20px "Inter", system-ui, -apple-system, sans-serif',
        fullName: '600 12px "Inter", system-ui, -apple-system, sans-serif',
        memberName: '600 13px "Inter", system-ui, -apple-system, sans-serif',
        memberRole: '11px "Inter", system-ui, -apple-system, sans-serif',
        title: 'bold 28px "Inter", system-ui, -apple-system, sans-serif',
        subtitle: '14px "Inter", system-ui, -apple-system, sans-serif'
    };
    
    // Helper function to measure text width
    const measureWidth = (text, font) => {
        ctx.font = font;
        return ctx.measureText(text).width;
    };
    
    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x, y, width, height, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    };
    
    // Calculate team dimensions
    teams.forEach(team => {
        const contentWidths = [
            measureWidth(team.name, fonts.header),
            measureWidth(team.fullName, fonts.fullName)
        ];
        
        team.members.forEach(member => {
            contentWidths.push(measureWidth(member.name, fonts.memberName));
            contentWidths.push(measureWidth(member.role, fonts.memberRole));
        });
        
        const neededWidth = Math.max(...contentWidths) + padding * 2;
        team.width = Math.min(maxBoxWidth, Math.max(baseBoxWidth, neededWidth));
        team.height = headerHeight + padding * 2 + (team.members.length * memberLineHeight) + 40;
    });
    
    // Calculate canvas dimensions
    const containerWidth = Math.max((container.clientWidth || 0) - 64, 1000);
    const topTeams = teams.filter(team => ['CIS', 'OAII', 'OEM'].includes(team.name));
    const bottomTeams = teams.filter(team => ['OUR', 'SOL'].includes(team.name));
    
    const calcTotalWidth = list => {
        if (!list.length) return 0;
        return list.reduce((sum, team) => sum + team.width, 0) + horizontalSpacing * (list.length - 1);
    };
    const getMaxHeight = list => list.reduce((max, team) => Math.max(max, team.height), 0);
    
    const totalTopWidth = calcTotalWidth(topTeams);
    const totalBottomWidth = calcTotalWidth(bottomTeams);
    const minCanvasWidth = Math.max(totalTopWidth, totalBottomWidth) + 160;
    const canvasWidth = Math.max(containerWidth, minCanvasWidth);
    
    const topRowY = 140;
    const maxTopHeight = getMaxHeight(topTeams);
    const bottomRowY = topRowY + maxTopHeight + verticalSpacing;
    const maxBottomHeight = getMaxHeight(bottomTeams);
    const canvasHeight = bottomRowY + maxBottomHeight + 140;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    
    // Clear canvas with modern gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    bgGradient.addColorStop(0, '#ffffff');
    bgGradient.addColorStop(1, '#f8f9fa');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Position teams with better spacing
    let currentX = (canvasWidth - totalTopWidth) / 2;
    topTeams.forEach(team => {
        team.x = currentX;
        team.y = topRowY;
        team.centerX = team.x + team.width / 2;
        team.centerY = team.y + team.height / 2;
        currentX += team.width + horizontalSpacing;
    });
    
    currentX = (canvasWidth - totalBottomWidth) / 2;
    bottomTeams.forEach(team => {
        team.x = currentX;
        team.y = bottomRowY;
        team.centerX = team.x + team.width / 2;
        team.centerY = team.y + team.height / 2;
        currentX += team.width + horizontalSpacing;
    });
    
    // Draw curved connecting lines with better routing
    const drawCurvedLine = (x1, y1, x2, y2, color, width = 2.5, dashed = true) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if (dashed) {
            ctx.setLineDash([10, 6]);
        } else {
            ctx.setLineDash([]);
        }
        
        ctx.beginPath();
        const midY = (y1 + y2) / 2;
        const controlY1 = y1 < y2 ? y1 + Math.abs(y2 - y1) * 0.3 : y1 - Math.abs(y2 - y1) * 0.3;
        const controlY2 = y1 < y2 ? y2 - Math.abs(y2 - y1) * 0.3 : y2 + Math.abs(y2 - y1) * 0.3;
        
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1, controlY1, x2, controlY2, x2, y2);
        ctx.stroke();
        ctx.restore();
    };
    
    // Connect OAII (central) to all other teams with curved lines
    const oaiiTeam = teams.find(t => t.name === 'OAII');
    if (oaiiTeam) {
        teams.forEach(team => {
            if (team.name !== 'OAII') {
                drawCurvedLine(
                    oaiiTeam.centerX, oaiiTeam.centerY,
                    team.centerX, team.centerY,
                    '#94a3b8', 2.5, true
                );
            }
        });
    }
    
    // Connect CIS to OUR and SOL with curved lines (technical collaboration)
    const cisTeam = teams.find(t => t.name === 'CIS');
    const ourTeam = teams.find(t => t.name === 'OUR');
    const solTeam = teams.find(t => t.name === 'SOL');
    
    if (cisTeam && ourTeam) {
        drawCurvedLine(
            cisTeam.centerX, cisTeam.y + cisTeam.height,
            ourTeam.centerX, ourTeam.y,
            '#6366f1', 2.5, false
        );
    }
    
    if (cisTeam && solTeam) {
        drawCurvedLine(
            cisTeam.x + cisTeam.width, cisTeam.centerY,
            solTeam.x, solTeam.centerY,
            '#6366f1', 2.5, false
        );
    }
    
    // Draw team boxes with modern styling
    teams.forEach(team => {
        const x = team.x;
        const y = team.y;
        const width = team.width;
        const height = team.height;
        
        // Draw glow effect
        ctx.save();
        ctx.shadowColor = team.glowColor;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw shadow with rounded corners
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        drawRoundedRect(x + 6, y + 6, width, height, borderRadius);
        ctx.fill();
        ctx.restore();
        
        // Draw box background with vibrant gradient
        const boxGradient = ctx.createLinearGradient(x, y, x, y + height);
        boxGradient.addColorStop(0, '#ffffff');
        boxGradient.addColorStop(1, team.lightColor);
        ctx.fillStyle = boxGradient;
        drawRoundedRect(x, y, width, height, borderRadius);
        ctx.fill();
        
        // Draw border with gradient
        ctx.strokeStyle = team.color;
        ctx.lineWidth = 3;
        drawRoundedRect(x, y, width, height, borderRadius);
        ctx.stroke();
        
        // Draw header with vibrant gradient
        const headerGradient = ctx.createLinearGradient(x, y, x, y + headerHeight);
        headerGradient.addColorStop(0, team.color);
        headerGradient.addColorStop(1, team.accentColor);
        ctx.fillStyle = headerGradient;
        drawRoundedRect(x, y, width, headerHeight, borderRadius);
        ctx.fill();
        
        // Draw header bottom curve (rounded effect)
        ctx.fillStyle = team.color;
        ctx.fillRect(x, y + headerHeight - 8, width, 8);
        
        // Team name with shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#ffffff';
        ctx.font = fonts.header;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(team.name, x + width / 2, y + headerHeight / 2);
        ctx.restore();
        
        // Draw full name section
        const fullNameY = y + headerHeight + padding;
        ctx.fillStyle = '#0033A1';
        ctx.font = fonts.fullName;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(team.fullName, x + padding, fullNameY);
        
        // Draw modern divider
        const dividerY = fullNameY + 22;
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + padding, dividerY);
        ctx.lineTo(x + width - padding, dividerY);
        ctx.stroke();
        
        // Draw members with better spacing
        let memberY = dividerY + 24;
        team.members.forEach((member, index) => {
            // Member name with subtle color
            ctx.fillStyle = '#1f2937';
            ctx.font = fonts.memberName;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(member.name, x + padding, memberY);
            
            // Member role
            ctx.fillStyle = '#6b7280';
            ctx.font = fonts.memberRole;
            ctx.fillText(member.role, x + padding, memberY + 18);
            
            memberY += memberLineHeight;
        });
    });
    
    // Draw modern title with gradient
    const titleGradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    titleGradient.addColorStop(0, '#0033A1');
    titleGradient.addColorStop(1, '#0046C7');
    ctx.fillStyle = titleGradient;
    ctx.font = fonts.title;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('DegreeWorks Project Team Collaboration', canvasWidth / 2, 35);
    
    // Draw subtitle
    ctx.fillStyle = '#6b7280';
    ctx.font = fonts.subtitle;
    ctx.fillText('Organizational Structure & Collaboration Flow', canvasWidth / 2, 72);
    
    // Add dynamic fade-in animation
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 0.6s ease-in';
    requestAnimationFrame(() => {
        canvas.style.opacity = '1';
    });
}

// Initialize collaboration diagram when accordion opens
function setupCollaborationDiagram() {
    const accordionItem = document.querySelector('[data-status-accordion="team-collaboration"]');
    if (!accordionItem) return;
    
    const trigger = accordionItem.querySelector('.status-accordion-trigger');
    const panel = accordionItem.querySelector('.status-accordion-panel');
    
    if (trigger && panel) {
        trigger.addEventListener('click', function() {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                panel.style.display = 'block';
                // Draw diagram when accordion opens
                setTimeout(() => {
                    drawCollaborationDiagram();
                }, 100);
            } else {
                panel.style.display = 'none';
            }
        });
    }
    
    // Also draw if already open
    if (panel && panel.style.display !== 'none') {
        setTimeout(() => {
            drawCollaborationDiagram();
        }, 100);
    }
}
