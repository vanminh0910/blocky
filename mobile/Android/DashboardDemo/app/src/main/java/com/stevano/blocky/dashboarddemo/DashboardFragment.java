package com.stevano.blocky.dashboarddemo;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Created by stevenminh on 8/18/17.
 */

public class DashboardFragment extends android.support.v4.app.Fragment {
    public DashboardFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {

        View view = inflater.inflate(R.layout.dashboard_fragment, container, false);


        final WebView webView = (WebView) view.findViewById(R.id.dashboard_web);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url)
            {
                webView.loadUrl("http://staging.blocky.easytech.vn/#/dashboard");
                webView.loadUrl("javascript:(function() { " +
                        "document.getElementsByClassName('_md')[0].style.display='none'; " +
                        "})()");
            }
        });
        webView.loadUrl("http://staging.blocky.easytech.vn/#/dashboard");


        return view;
    }
}


