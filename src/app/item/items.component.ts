import {HttpParams} from '@angular/common/http';
import {Component, OnInit} from "@angular/core";
import {Dialogs, Utils} from '@nativescript/core';
import {InAppBrowser} from 'nativescript-inappbrowser';
import {AuthSessionResult, RedirectEvent, RedirectResult} from 'nativescript-inappbrowser/InAppBrowser.common';

import {Item} from "./item";
import {ItemService} from "./item.service";

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;
    private readonly REDIRECT_URI = 'my-app://auth';

    constructor(private itemService: ItemService) {
    }

    ngOnInit(): void {
        this.items = this.itemService.getItems();
    }

    public async openBrowser(): Promise<void> {
        await this.login();
    }

    public async login(): Promise<AuthSessionResult> {
        const httpParams = new HttpParams().set('redirect_uri', this.REDIRECT_URI);
        const authUrl = `https://mgjy3.mocklab.io/oauth/authorize?${httpParams}`;

        try {
            if (await InAppBrowser.isAvailable()) {
                return await InAppBrowser.openAuth(authUrl, this.REDIRECT_URI, {
                    // iOS
                    dismissButtonStyle: 'cancel',
                    readerMode: false,
                    modalPresentationStyle: 'popover',
                    modalEnabled: true,
                    enableBarCollapsing: false,

                    // Android
                    showTitle: true,
                    enableUrlBarHiding: true,
                    enableDefaultShare: false
                });
            } else {
                Utils.openUrl(authUrl);
            }
        } catch (error) {
            await Dialogs.alert({
                title: 'Error',
                message: error.message,
                okButtonText: 'Ok'
            });
        }
    }
}
