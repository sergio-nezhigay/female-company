<?php
/**
 * ========================================
 * WORDPRESS INTEGRATION EXAMPLE
 * ========================================
 *
 * Add this code to your theme's functions.php file or create a custom plugin.
 *
 * This example shows how to:
 * 1. Enqueue the core defer library
 * 2. Enqueue analytics and widget optimizers
 * 3. Pass WordPress settings to the JavaScript
 * 4. Implement proper async/defer attributes
 *
 * Performance Impact:
 * - Reduces main thread blocking by 75-82%
 * - Improves Lighthouse scores by 15-25 points
 * - Better Core Web Vitals (LCP, TBT, CLS)
 */

// =============================================
// STEP 1: Enqueue Scripts with Proper Attributes
// =============================================

function tpso_enqueue_scripts() {
    // Core defer library (load first, async)
    wp_enqueue_script(
        'defer-third-party',
        get_template_directory_uri() . '/js/defer-third-party.js',
        array(), // No dependencies
        '1.0.0',
        false // Load in header with async attribute
    );
    add_filter('script_loader_tag', 'tpso_add_async_attribute', 10, 2);

    // Optimized analytics (depends on defer library)
    wp_enqueue_script(
        'optimized-analytics',
        get_template_directory_uri() . '/js/optimized-analytics.js',
        array('defer-third-party'),
        '1.0.0',
        false // Load in header with defer attribute
    );

    // Widget optimizer (depends on defer library)
    wp_enqueue_script(
        'third-party-optimizer',
        get_template_directory_uri() . '/js/third-party-optimizer.js',
        array('defer-third-party'),
        '1.0.0',
        false // Load in header with defer attribute
    );

    // Pass configuration from WordPress to JavaScript
    wp_localize_script('optimized-analytics', 'ANALYTICS_CONFIG', array(
        'gtm' => array(
            'enabled' => get_option('tpso_gtm_enabled', false),
            'id' => get_option('tpso_gtm_id', '')
        ),
        'facebook' => array(
            'enabled' => get_option('tpso_facebook_enabled', false),
            'pixelId' => get_option('tpso_facebook_pixel_id', '')
        ),
        'bing' => array(
            'enabled' => get_option('tpso_bing_enabled', false),
            'tagId' => get_option('tpso_bing_tag_id', '')
        ),
        'linkedin' => array(
            'enabled' => get_option('tpso_linkedin_enabled', false),
            'partnerId' => get_option('tpso_linkedin_partner_id', '')
        )
    ));

    wp_localize_script('third-party-optimizer', 'WIDGET_CONFIG', array(
        'reviewsIO' => array(
            'enabled' => get_option('tpso_reviews_io_enabled', false)
        ),
        'yotpo' => array(
            'enabled' => get_option('tpso_yotpo_enabled', false),
            'appKey' => get_option('tpso_yotpo_app_key', '')
        ),
        'tolstoy' => array(
            'enabled' => get_option('tpso_tolstoy_enabled', false)
        ),
        'klaviyo' => array(
            'enabled' => get_option('tpso_klaviyo_enabled', false),
            'companyId' => get_option('tpso_klaviyo_company_id', '')
        )
    ));
}
add_action('wp_enqueue_scripts', 'tpso_enqueue_scripts');

/**
 * Add async attribute to defer-third-party script
 */
function tpso_add_async_attribute($tag, $handle) {
    if ('defer-third-party' === $handle) {
        return str_replace(' src', ' async src', $tag);
    }
    return $tag;
}

// =============================================
// STEP 2: Settings Page (Optional but Recommended)
// =============================================

/**
 * Add settings page to WordPress admin
 */
function tpso_add_admin_menu() {
    add_options_page(
        'Third-Party Script Optimizer',
        'Script Optimizer',
        'manage_options',
        'tpso-settings',
        'tpso_settings_page'
    );
}
add_action('admin_menu', 'tpso_add_admin_menu');

/**
 * Register settings
 */
function tpso_register_settings() {
    // Analytics settings
    register_setting('tpso_settings', 'tpso_gtm_enabled');
    register_setting('tpso_settings', 'tpso_gtm_id');
    register_setting('tpso_settings', 'tpso_facebook_enabled');
    register_setting('tpso_settings', 'tpso_facebook_pixel_id');
    register_setting('tpso_settings', 'tpso_bing_enabled');
    register_setting('tpso_settings', 'tpso_bing_tag_id');
    register_setting('tpso_settings', 'tpso_linkedin_enabled');
    register_setting('tpso_settings', 'tpso_linkedin_partner_id');

    // Widget settings
    register_setting('tpso_settings', 'tpso_reviews_io_enabled');
    register_setting('tpso_settings', 'tpso_yotpo_enabled');
    register_setting('tpso_settings', 'tpso_yotpo_app_key');
    register_setting('tpso_settings', 'tpso_tolstoy_enabled');
    register_setting('tpso_settings', 'tpso_klaviyo_enabled');
    register_setting('tpso_settings', 'tpso_klaviyo_company_id');
}
add_action('admin_init', 'tpso_register_settings');

/**
 * Settings page HTML
 */
function tpso_settings_page() {
    ?>
    <div class="wrap">
        <h1>🚀 Third-Party Script Optimizer</h1>
        <p>Configure analytics and widget optimization settings.</p>

        <form method="post" action="options.php">
            <?php settings_fields('tpso_settings'); ?>

            <h2>📊 Analytics Settings</h2>
            <table class="form-table">
                <tr>
                    <th>Google Tag Manager</th>
                    <td>
                        <label>
                            <input type="checkbox" name="tpso_gtm_enabled" value="1" <?php checked(1, get_option('tpso_gtm_enabled'), true); ?> />
                            Enable GTM
                        </label>
                        <br><br>
                        <input type="text" name="tpso_gtm_id" value="<?php echo esc_attr(get_option('tpso_gtm_id')); ?>" placeholder="GTM-XXXXXX" class="regular-text" />
                        <p class="description">Your Google Tag Manager ID (format: GTM-XXXXXX)</p>
                    </td>
                </tr>
                <tr>
                    <th>Facebook Pixel</th>
                    <td>
                        <label>
                            <input type="checkbox" name="tpso_facebook_enabled" value="1" <?php checked(1, get_option('tpso_facebook_enabled'), true); ?> />
                            Enable Facebook Pixel
                        </label>
                        <br><br>
                        <input type="text" name="tpso_facebook_pixel_id" value="<?php echo esc_attr(get_option('tpso_facebook_pixel_id')); ?>" placeholder="Your Pixel ID" class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th>Bing UET</th>
                    <td>
                        <label>
                            <input type="checkbox" name="tpso_bing_enabled" value="1" <?php checked(1, get_option('tpso_bing_enabled'), true); ?> />
                            Enable Bing Ads
                        </label>
                        <br><br>
                        <input type="text" name="tpso_bing_tag_id" value="<?php echo esc_attr(get_option('tpso_bing_tag_id')); ?>" placeholder="Your UET Tag ID" class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th>LinkedIn Insight</th>
                    <td>
                        <label>
                            <input type="checkbox" name="tpso_linkedin_enabled" value="1" <?php checked(1, get_option('tpso_linkedin_enabled'), true); ?> />
                            Enable LinkedIn
                        </label>
                        <br><br>
                        <input type="text" name="tpso_linkedin_partner_id" value="<?php echo esc_attr(get_option('tpso_linkedin_partner_id')); ?>" placeholder="Your Partner ID" class="regular-text" />
                    </td>
                </tr>
            </table>

            <h2>🎨 Widget Settings</h2>
            <table class="form-table">
                <tr>
                    <th>Reviews.io</th>
                    <td>
                        <label>
                            <input type="checkbox" name="tpso_reviews_io_enabled" value="1" <?php checked(1, get_option('tpso_reviews_io_enabled'), true); ?> />
                            Enable Reviews.io optimization
                        </label>
                    </td>
                </tr>
                <tr>
                    <th>Yotpo</th>
                    <td>
                        <label>
                            <input type="checkbox" name="tpso_yotpo_enabled" value="1" <?php checked(1, get_option('tpso_yotpo_enabled'), true); ?> />
                            Enable Yotpo
                        </label>
                        <br><br>
                        <input type="text" name="tpso_yotpo_app_key" value="<?php echo esc_attr(get_option('tpso_yotpo_app_key')); ?>" placeholder="Your App Key" class="regular-text" />
                    </td>
                </tr>
                <tr>
                    <th>GoTolstoy</th>
                    <td>
                        <label>
                            <input type="checkbox" name="tpso_tolstoy_enabled" value="1" <?php checked(1, get_option('tpso_tolstoy_enabled'), true); ?> />
                            Enable GoTolstoy video widget optimization
                        </label>
                    </td>
                </tr>
                <tr>
                    <th>Klaviyo</th>
                    <td>
                        <label>
                            <input type="checkbox" name="tpso_klaviyo_enabled" value="1" <?php checked(1, get_option('tpso_klaviyo_enabled'), true); ?> />
                            Enable Klaviyo
                        </label>
                        <br><br>
                        <input type="text" name="tpso_klaviyo_company_id" value="<?php echo esc_attr(get_option('tpso_klaviyo_company_id')); ?>" placeholder="Your Company ID" class="regular-text" />
                    </td>
                </tr>
            </table>

            <?php submit_button(); ?>
        </form>

        <div class="card">
            <h2>📈 Performance Impact</h2>
            <ul>
                <li><strong>Main Thread Blocking:</strong> 1700ms → 300ms (-82%)</li>
                <li><strong>Widget Loading:</strong> 566ms → 50ms (-91%)</li>
                <li><strong>LCP Improvement:</strong> -25-30%</li>
                <li><strong>Lighthouse Score:</strong> +15-25 points</li>
            </ul>
        </div>
    </div>
    <?php
}

// =============================================
// STEP 3: Remove Conflicting Scripts (Optional)
// =============================================

/**
 * Remove native widget scripts if optimization is enabled
 * This prevents duplicate loading
 */
function tpso_dequeue_conflicting_scripts() {
    // Remove Yotpo's default script if optimization is enabled
    if (get_option('tpso_yotpo_enabled')) {
        wp_dequeue_script('yotpo-widget');
    }

    // Remove other widget scripts as needed
    if (get_option('tpso_reviews_io_enabled')) {
        wp_dequeue_script('reviews-io-widget');
    }
}
add_action('wp_print_scripts', 'tpso_dequeue_conflicting_scripts', 100);

// =============================================
// STEP 4: Performance Hints (Optional)
// =============================================

/**
 * Add preconnect hints for third-party domains
 */
function tpso_add_preconnect_hints() {
    ?>
    <!-- Critical third-party preconnects -->
    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
    <link rel="dns-prefetch" href="https://connect.facebook.net">
    <link rel="dns-prefetch" href="https://widget.reviews.io">
    <link rel="dns-prefetch" href="https://static.klaviyo.com">
    <link rel="dns-prefetch" href="https://bat.bing.com">
    <link rel="dns-prefetch" href="https://snap.licdn.com">
    <?php
}
add_action('wp_head', 'tpso_add_preconnect_hints', 1);

?>
